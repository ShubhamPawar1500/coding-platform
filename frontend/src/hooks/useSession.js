import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionApi } from "../api/session";

export const useCreateSession = () =>{
    const result = useMutation({
        mutationKey: ["createSession"],
        mutationFn: sessionApi.createSession,
        onSuccess: () => toast.success("Session Created Successfully"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to create session"),
    })

    return result;
}

export const useActiveSessions = () =>{
    const result = useQuery({
        queryKey: ["activeSessions"],
        queryFn: sessionApi.getActiveSession
    })

    return result;
}

export const useMyRecentSessions = () =>{
    const result = useQuery({
        queryKey: ["myRecentSessions"],
        queryFn: sessionApi.getMyRecentSessions
    });

    return result;
}

export const useSessionById = (id) =>{
    const result = useQuery({
        queryKey: ["session", id],
        queryFn: () => sessionApi.getSessionById(id),
        enabled: !!id,
        refetchInterval: 5000
    });

    return result;
}

export const useJoinSession = (id) =>{
    return useMutation({
        mutationKey: ["joinSession"],
        mutationFn: () => sessionApi.joinSession(id),
        onSuccess: () => toast.success("Joined the session Successfully"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to join session")
    })
}

export const useEndSession = (id) =>{
    return useMutation({
        mutationKey: ["endSession"],
        mutationFn: () => sessionApi.endSession(id),
        onSuccess: () => toast.success("Joined ended Successfully"),
        onError: (error) => toast.error(error.response?.data?.message || "Failed to end session")
    })
}