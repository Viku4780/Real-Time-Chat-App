import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/conversations/chatSlice';
import conversationReducer from '../features/conversations/conversationSlice';
import userReducer from '../features/users/userSlice';
import { destroyGlobalStore } from './action';

const appReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    conversation: conversationReducer,
    user: userReducer,
})

const rootReducer = (state, action) => {
    if (action.type === destroyGlobalStore.type) {
        state = undefined;
    }
    return appReducer(state, action);
}

const store = configureStore({
    reducer: rootReducer,
});

export default store;