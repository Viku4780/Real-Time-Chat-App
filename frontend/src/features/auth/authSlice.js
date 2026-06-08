import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config/axios";
import toast from 'react-hot-toast';
import {BASE_URL} from '../../config/api'

const initialState = {
    user: null,
    loading: false,
    error: null,
    onlineUsers: [],
};

export const checkUserAuth = createAsyncThunk("auth/checkUserAuth", async () => {
    try {
        const res = await axiosInstance.get("/auth/check");

        return res.data;
    } catch (error) {
        console.log("Error in authcheck:", error);
    }
});

export const signUpUser = createAsyncThunk("auth/signUpUser", async (data, thunkAPI) => {
    try {
        const res = await axiosInstance.post("/auth/signup", data);
        toast.success("Account created successfully!");

        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || "Signup failed";
        toast.error(message);
        const {rejectWithValue} = thunkAPI;
        return rejectWithValue(message); // Now .rejected will actually trigger
    }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (data, thunkAPI) => {
    try {
        const res = await axiosInstance.post("/auth/login", data);
        toast.success("Logged in successfully!");

        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
        const {rejectWithValue} = thunkAPI;
        return rejectWithValue(message);
    }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (__, thunkAPI) => {
    try {
        const res = await axiosInstance.post("/auth/logout");
        toast.success("Logged out successfully");

        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || "Logout failed";
        toast.error(message);
        const {rejectWithValue} = thunkAPI;
        return rejectWithValue(message);
    }
});

export const updateUserProfile = createAsyncThunk("auth/updateUserProfile", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        toast.success("Profile updated successfully");

        return res.data;
    } catch (error) {
        const message = error.response?.data?.message || "Error updating profile";
        toast.error(message);
        return rejectWithValue(message);
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateOnlineUser: (state,action) => {
            state.onlineUsers = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // keep fulfilled cases separate as they update different state parts
            .addCase(checkUserAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                // toast.success("Account created successfully!");  separation of concerns (UI in logic )  reducers should be pure - they should  only calculate the next state, not  trigger real world actions
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;

            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;

            })
            // handle all pending state at once
            .addMatcher(
                isPending(checkUserAuth, signUpUser, loginUser, logoutUser, updateUserProfile), (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            // handle all rejected state at once
            .addMatcher(
                isRejected(checkUserAuth, signUpUser, loginUser, logoutUser, updateUserProfile), (state, action) => {
                    state.loading = false;
                    state.error = action.payload || action.error.message;
                }
            )

    }
});

export const {updateOnlineUser} = authSlice.actions;
export default authSlice.reducer;