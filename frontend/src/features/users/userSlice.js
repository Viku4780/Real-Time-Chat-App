import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config/axios";
import toast from "react-hot-toast";

const initialState = {
  allContacts: [],
  isUsersLoading: false,
  isUsersError: false,
  profile: null,
  isProfileLoading: false,
  isProfileError: false,
  selectedUser: null
}

export const getAllContacts = createAsyncThunk('user/getAllContacts', async (__, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('/user/getAllContacts');
    console.log(res.data);
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    rejectWithValue(error.response.data?.message);
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllContacts.pending, (state) => {
        state.isUsersLoading = true;
        state.isUsersError = false;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.allContacts = action.payload;
      })
      .addCase(getAllContacts.rejected, (state) => {
        state.isUsersLoading = false;
        state.isUsersError = true;
      })
  }
})

export const {setSelectedUser} = userSlice.actions;

export default userSlice.reducer;