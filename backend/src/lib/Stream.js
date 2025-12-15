import { StreamChat } from 'stream-chat';
import { StreamClient } from '@stream-io/node-sdk';
import { ENV } from './Env.js';

const API_KEY = ENV.STREAM_API_KEY
const API_SECRET = ENV.STREAM_SECRET_KEY

if (!API_KEY || !API_SECRET) {
    console.error(`Stream Api key or secret key is missing`);
}

export const chatClient = StreamChat.getInstance(API_KEY, API_SECRET);  // chat feature
export const streamClient = new StreamClient(API_KEY, API_SECRET)   // video call

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log('Stream user upserted successfully:', userData);
    } catch (error) {
        console.error("Error upserting stream user:", error);
    }
}

export const deleteStreamUser = async (id) => {
    try {
        await chatClient.deleteUser(id);
        console.log("Stream user deleted successfully");
    } catch (error) {
        console.error("Error deleting stream user:", error);
    }
}