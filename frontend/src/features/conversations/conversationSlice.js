import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";
import { dateInNumber } from "../../utils/dateGenerator";

const initialState = {
    chatLists: [],
    isChatListLoading: false,
    chatListError: false,
    activeConversation: null, // this is causing more issue i mean in message delivery
    isActiveConversation: false,
    activeConversationError: false,
};


export const createConversation = createAsyncThunk('conversation/createConversation', async (userIdData, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post('/conversation/create', userIdData);

        return res.data;
    } catch (error) {
        toast.error(error.response.data.message);
        rejectWithValue(error.response.data?.message);
    }
});

export const findAllConversation = createAsyncThunk('conversation/findAllConversation', async (__, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get('/conversation/conversation-lists');

        return res.data
    } catch (error) {
        toast.error(error.response.data.message);
        rejectWithValue(error.response.data?.message);
    }
})

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        deleteConversation(state) {
            state.activeConversation = null;
        },

        updateChatList: (state, action) => {
            const idx = state.chatLists.findIndex(chat => chat._id === action.payload.conversationId);

            if (idx !== -1) {
                const lastMessageObj = state.chatLists[idx].lastMessagePerUser[0];

                if (state.chatLists[idx]._id === state.activeConversation) {
                    state.chatLists[idx].unReadCountPerUser[0].count = 0
                } else {
                    state.chatLists[idx].unReadCountPerUser[0] = action.payload.unReadMessage;
                }

                state.chatLists[idx].updatedAt = action.payload.updatedAt;

                const requiredObj = lastMessageObj.message;
                requiredObj._id = action.payload._id;

                requiredObj.senderId = action.payload.senderId;
                requiredObj.text = action.payload.text;
                requiredObj.createdAt = action.payload.createdAt;

                state.chatLists.sort((a, b) => dateInNumber(b.updatedAt) - dateInNumber(a.updatedAt));
            }

        },
        updateUnReadMessageCountToZero: (state) => {
             const idx = state.chatLists.findIndex(chat => chat._id === state.activeConversation);

            if (idx !== -1) {
                const requiredObj = state.chatLists[idx];
                requiredObj.unReadCountPerUser[0].count = 0
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createConversation.pending, (state) => {
                state.isActiveConversation = true;
                state.activeConversationError = false;
            })
            .addCase(createConversation.fulfilled, (state, action) => {
                state.isActiveConversation = false;
                state.activeConversation = action.payload.conversationId;
            })
            .addCase(createConversation.rejected, (state) => {
                state.isActiveConversation = false;
                state.activeConversationError = true;
            })
            .addCase(findAllConversation.pending, (state) => {
                state.isChatListLoading = true;
                state.chatListError = false;
            })
            .addCase(findAllConversation.fulfilled, (state, action) => {
                state.isChatListLoading = false;
                state.chatLists = action.payload;
            })
            .addCase(findAllConversation.rejected, (state) => {
                state.isChatListLoading = false;
                state.chatListError = true;
            })
    }
})

export const { deleteConversation, updateChatList, updateUnReadMessageCountToZero } = conversationSlice.actions;

export default conversationSlice.reducer;