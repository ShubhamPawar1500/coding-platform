import { chatClient, streamClient } from "../lib/Stream.js";
import Session from "../models/Session.js"

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body;
        const userId = req.user._id
        const clerkId = req.user.clerkId

        if (!problem || !difficulty) {
            res.status(400).json({ message: "problem and difficulty required" })
        }

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            callId
        })

        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {
                    problem,
                    difficulty,
                    sessionId: session._id.toString()
                }
            }
        });

        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId]
        })
        
        await channel.create()

        res.status(201).json({session})

    } catch (error) {
        console.log("Error in CreateSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getActiveSessions(_, res) {
    try {
        const session = Session.find({status:"active"})
        .populate("host", "name profileImage email clerkId")
        .sort({createdat:-1})
        .limit(20);

        res.status(200).json({session})
    } catch (error) {
        console.log("Error in getActiveSessions Controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id;

        const sessions = await Session.find({
            status: "completed",
            $or: [{host: userId}, {participant: userId}],
        })
        .sort({createdat: -1})
        .limit(20);

        res.status(200).json({sessions});
    } catch (error) {
        console.log("Error in getMyRecentSessions Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getSessionById(req, res) { 
    try {
        const { id } = req.params;
        const session =  await Session.findByid(id)
        .populate("host", "name email profileImage clerkId")
        .populate("participant", "name email profileImage clerkId")

        if(!session) return res.status(404).json({message: "Session Not Found"});

        res.status(200).json({session});
    } catch (error) {
        console.log("Error in getSessionById Controller", error.message);
        res.status(500).json({ message: "Interal Server Error" });
    }
}

export async function joinSession(req, res) { 
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);

        if(!session) return res.status(404).json({ message: "Session Not Found"});

        if(session.status !== "active"){
            return res.status(400).json({ message: "cannot join completed session"});
        }

        if(session.host.toString() === userId.toString()){
            return res.status(400).json({ message: "Host cannot join there own session as participant"});
        }

        if(session.participant) return res.status(409).json({ message: "Session is full"});

        session.participant = userId
        await session.save();

        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId])

        res.status(200).json({session});
    } catch (error) {
        console.log("Error in joinSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);
        if(!session) return res.status(404).json({ message: "Session Not Found"});

        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({ message: "only host can end session"});
        }

        if(session.status === "completed"){
            return res.status(400).json({ message: "Session is already ended"});
        }

        const call = streamClient.video.call("default", session.callId);
        await call.delete({hard: true});

        const chat = chatClient.channel("messaging", session.callId)
        await chat.delete();

        session.status = "completed";
        await session.save();
        
        res.status(200).json({session, message: "Session Ended Successfully"});
    } catch (error) {
        console.log("Error in endSession controller", error.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}