import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../config/axios';
import { db } from '../../database/config/indexedDB';

const initialState = {
    messages: [],
    activeTab: "chats",
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
    messageSendingLoading: false,
};


export const getMessagesByConversationId = createAsyncThunk("chat/getMessagesByUserId", async (conversationId, thunkAPI) => {

    try {
        const res = await axiosInstance.get(`/messages/${conversationId}`);
        // set({ messages: res.data });
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        const rejectWithValue = thunkAPI.rejectWithValue;
        rejectWithValue(error.response.data?.message);
    }
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async (messageData, thunkAPI) => {
    // 1. Call getState to retrieve the full state object and thunkAPI can only be used in createAsyncThunk and reducers should be pure function
    // const state = thunkAPI.getState();
    try {
        const res = await axiosInstance.post(`/messages/send`, messageData);
        // console.log(res.data);
        // const message = await db.messages.add(messageData);
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
        const { rejectWithValue } = thunkAPI;
        rejectWithValue(error.response.data?.message);
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        toggleSound: (state) => {
            localStorage.setItem("isSoundEnabled", !state.isSoundEnabled);
            // set({ isSoundEnabled: !get().isSoundEnabled })
            state.isSoundEnabled = !state.isSoundEnabled;
        },

        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },

        addingNewMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },

        subscribeToMessages: (state, action) => {
            // console.log('running subscribe message', action.payload)
            const { isSoundEnabled } = state;
            // console.log(action.payload);
            const { selectedUserId } = action.payload;
            if (!selectedUserId) return;

            const { data } = action.payload;
            // console.log(newMessage);

            const isMessageSentFromSelectedUser = data.senderId === selectedUserId;
            if (!isMessageSentFromSelectedUser) return;

            state.messages = [...state.messages, data];

            if (isSoundEnabled) {
                const notificationSound = new Audio("/sound/notification.mp3");

                notificationSound.currentTime = 0; // reset to start
                notificationSound.play().catch((e) => console.log("audio play failed:", e));
            }
        },
        updateMessageStatus: (state, action) => {
            console.log('idx: ');
            const idx = state.messages.findIndex(message => message._id === action.payload.messageId);
            

            if (idx !== -1) {
                console.log('idx: ', idx);
                state.messages[idx].status = action.payload.status;
            }
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessagesByConversationId.pending, (state) => {
                state.isMessagesLoading = true;
            })
            .addCase(getMessagesByConversationId.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = action.payload;
            })
            .addCase(getMessagesByConversationId.rejected, (state) => {
                state.isMessagesLoading = false;
            })
            .addCase(sendMessage.pending, (state) => {
                state.messageSendingLoading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messageSendingLoading = false;
                // console.log(action.payload);
                const { data, temporaryId } = action.payload;

                const index = state.messages.findIndex(message => message._id === temporaryId);
                if (index !== -1) {
                    state.messages[index]._id = data._id;
                    state.messages[index].status = data.status;
                }

            })
            .addCase(sendMessage.rejected, (state) => {
                state.messageSendingLoading = false;
            })
    }
});

export const { toggleSound, setActiveTab, setSelectedUser, subscribeToMessages, addingNewMessage, updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;