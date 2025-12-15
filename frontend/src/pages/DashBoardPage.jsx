import { UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSession";
import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCard from "../components/StatsCard";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

const DashBoardPage = () => {

    const navigate = useNavigate();
    const { user } = useUser();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomConfig, setRoomConfig] = useState({ problem: "", difficutly: "" });

    const createSessionMutation = useCreateSession();
    const { data: activeSessionData, isLoading: loadingActiveSession } = useActiveSessions();
    const { data: recentSessionData, isLoading: loadingRecentSession } = useMyRecentSessions();

    const handleCreateRoom = () => {
        if (!roomConfig.problem || !roomConfig.difficutly) return;

        createSessionMutation.mutate({
            problem: roomConfig.problem,
            difficutly: roomConfig.difficutly.toLowerCase()
        },
        {
            onSuccess: (data) => {
                setShowCreateModal(false);
                navigate(`/session/${data.session._id}`)
            }
        }
        )
    }

    const activeSessions = activeSessionData?.sessions || [];
    const recentSessions = recentSessionData?.sessions || [];
    
    const isUserInSession = (session) =>{
        if(!user.id) return false;

        return session?.host?.clerkId === user.id || session?.participant?.clerkId === user.id;
    }

    return (
        <>
            <div className="min-h-screen bg-base-300">
                <Navbar />
                <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

                <div className="container mx-auto px-6 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <StatsCard
                            activeSessionCount={activeSessions.length}
                            recentSessionCount={recentSessions.length}
                        />
                        <ActiveSessions
                            sessions={activeSessions}
                            isLoading={loadingActiveSession}
                            isUserInSession={isUserInSession}
                        />
                    </div>

                    <RecentSessions
                        sessions={recentSessions}
                        isLoading={loadingRecentSession}
                    />
                </div>
            </div>

            <CreateSessionModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                roomConfig={roomConfig}
                setRoomConfig={setRoomConfig}
                onCreateRoom={handleCreateRoom}
                isCreating={createSessionMutation.isPending}
            />
        </>
    )
}

export default DashBoardPage;