import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/conversations/chatSlice';
import conversationReducer from '../features/conversations/conversationSlice';
import userReducer from '../features/users/userSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        conversation : conversationReducer,
        user: userReducer,
    }
});

export default store;