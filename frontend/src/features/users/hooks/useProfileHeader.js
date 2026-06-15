import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, updateUserProfile } from '../../auth/authSlice';
import { toggleSound } from '../../conversations/chatSlice';
import socketProvider from '../../realtime/service/socket.service';

const mouseClickSound = new Audio("/sound/mouse-click.mp3");

const useProfileHeader = () => {
    const { isSoundEnabled } = useSelector(state => state.chat);
    const [selectedImg, setSelectedImg] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const fileInputRef = useRef();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            dispatch(updateUserProfile({ profilePic: base64Image }));
        }
    };
    // console.log(socketProvider)

    const handleLogout = () => {
        dispatch(logoutUser());
        socketProvider.disconnect();
    };

    const handleToggleSound = () => {
        // play click sound before toggling
        mouseClickSound.currentTime = 0; // reset to start
        mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
        dispatch(toggleSound());
    }


    return { fileInputRef, selectedImg, user, isSoundEnabled, handleImageUpload, handleLogout,handleToggleSound }
}

export default useProfileHeader
