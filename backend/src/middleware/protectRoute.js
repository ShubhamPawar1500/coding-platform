import { requireAuth } from '@clerk/express'
import User from '../models/Users.js'

export const protectRoute = [
    requireAuth(),
    async (req, res, next) =>{
        try {
            const clerkId = req.auth().userId;

            if(!clerkId) res.status(401).json({msg: 'Unauthorized Request'});

            const user = await User.findOne({clerkId});

            if(!user) return res.status(401).json({msg: 'User Not Found'});
            
            req.user = user;
            
            next();
        } catch (error) {
            console.log("Error in protected route middleware", error); 
            res.status(500).json({ mesage: "Internal Server Error"});
        }
    }
]