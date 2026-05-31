import React from 'react'
import { useState, useRef } from 'react';
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from 'lucide-react';
import { logoutUser, updateUserProfile } from '../../auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSound } from '../../chat/chatSlice'; 
import { useSocket } from '../../../hooks/SocketContext'; 

const mouseClickSound = new Audio("/sound/mouse-click.mp3");

const ProfileHeader = () => {
  const {isSoundEnabled} = useSelector(state => state.chat);
  const [selectedImg, setSelectedImg] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const socket = useSocket();

  const fileInputRef = useRef();

  // console.log("isSoundEnabled: ", isSoundEnabled);

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

  const handleLogout = () => {
    dispatch(logoutUser());
    console.log(socket);
    socket.close();
  }

  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* AVATAR */}
          <div className='avatar online'>
            <button className='size-14 rounded-full overflow-hidden relative group'
              onClick={() => fileInputRef.current.click()}
            >
              <img src={selectedImg || user?.profilePic || "/avatar.png"} alt="User image"
                className='size-full object-cover'
              />
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                <span className='text-white text-xs'>Change</span>
              </div>
            </button>

            <input
              type="file"
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className='text-slate-200 font-medium text-base max-w-[180px] truncate'>
              {user?.fullName}
            </h3>

            <p className='text-slate-400 text-xs'>Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex gap-4 items-center'>
          {/* LOGOUT BTN */}
          <button className='text-slate-400 hover:text-slate-200 transition-colors' onClick={() => handleLogout()}>
            <LogOutIcon className='size-5' />
          </button>

          {/* SOUND TOGGLE*/}
          <button className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              dispatch(toggleSound());
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className='size-5' />
            ) : (
              <VolumeOffIcon className='size-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
