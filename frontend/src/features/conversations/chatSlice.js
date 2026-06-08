import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../config/axios';

const initialState = {
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
};

export const getAllContacts = createAsyncThunk("chat/getAllContacts", async (__, { rejectWithValue }) => {

    try {
        const res = await axiosInstance.get("/messages/contacts");
        // set({allContacts: res.data})
        return res.data
    } catch (error) {
        toast.error(error.response.data.message);
        rejectWithValue(error.response.data?.message);
    }
});

export const getMyChatPartners = createAsyncThunk("chat/getChatPartners", async (__, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/messages/chats");
        // set({ chats: res.data })
        return res.data
    } catch (error) {
        toast.error(error.response.data.message);
        rejectWithValue(error.response.data?.message);
    }
});


export const getMessagesByUserId = createAsyncThunk("chat/getMessagesByUserId", async (userId, thunkAPI) => {

    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
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
    const state = thunkAPI.getState();
    try {
        const res = await axiosInstance.post(`/messages/send/${state.chat.selectedUser._id}`, messageData);
        // set({messages: messages.concat(res.data)});
        return res.data;
    } catch (error) {
        // remove optimistic message on failure
        // set({messages: messages});
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

        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },

        subscribeToMessages: (state, action) => {
            const { selectedUser, isSoundEnabled } = state;
            if (!selectedUser) return;

            const newMessage = action.payload;

            const isMessageSentFromSelectedUser = newMessage.senderId === state.selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            const currentMessages = state.messages;

            state.messages = [...currentMessages, newMessage]

            if (isSoundEnabled) {
                const notificationSound = new Audio("/sound/notification.mp3");

                notificationSound.currentTime = 0; // reset to start
                notificationSound.play().catch((e) => console.log("audio play failed:", e));
            }
    },

},
    extraReducers: (builder) => {
        builder
            .addCase(getAllContacts.pending, (state) => {
                state.isUsersLoading = true;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.isUsersLoading = false;
                state.allContacts = action.payload;
            })
            .addCase(getAllContacts.rejected, (state) => {
                state.isUsersLoading = false;
            })
            .addCase(getMyChatPartners.pending, (state) => {
                state.isUsersLoading = true;
            })
            .addCase(getMyChatPartners.fulfilled, (state, action) => {
                state.isUsersLoading = false;
                state.chats = action.payload;
            })
            .addCase(getMyChatPartners.rejected, (state) => {
                state.isUsersLoading = false;
            })
            .addCase(getMessagesByUserId.pending, (state) => {
                state.isMessagesLoading = true;
            })
            .addCase(getMessagesByUserId.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = action.payload;
            })
            .addCase(getMessagesByUserId.rejected, (state) => {
                state.isMessagesLoading = false;
            })
            .addCase(sendMessage.pending, (state) => {
                state.isMessagesLoading = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = state.messages.concat(action.payload);
            })
            .addCase(sendMessage.rejected, (state) => {
                state.isMessagesLoading = false;
            })
    }
});

export const { toggleSound, setActiveTab, setSelectedUser, subscribeToMessages } = chatSlice.actions;
export default chatSlice.reducer;