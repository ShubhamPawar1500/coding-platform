import axiosInstanc from '../lib/axios'

export const sessionApi = {
    createSession : async (data) => {
        const res = await axiosInstanc.post("/sessions", data);
        return res.data;
    },
    
    getActiveSession : async () => {
        const res = await axiosInstanc.get("/sessions/active");
        return res.data;
    },
    
    getMyRecentSessions : async () => {
        const res = await axiosInstanc.get("/sessions/my-recent");
        return res.data;
    },
    
    getSessionById : async (id) => {
        const res = await axiosInstanc.get(`/sessions/${id}`);
        return res.data;
    },
    
    joinSession : async (id) => {
        const res = await axiosInstanc.post(`/sessions/${id}/join`);
        return res.data;
    },

    endSession : async (id) => {
        const res = await axiosInstanc.post(`/sessions/${id}/end`);
        return res.data;
    },

    getStreamToken : async () => {
        const res = await axiosInstanc.get(`/chat/token`);
        return res.data;
    },
    

}