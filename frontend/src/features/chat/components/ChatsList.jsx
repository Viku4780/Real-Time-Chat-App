import React, { useEffect } from 'react'
// import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from '../../users/components/UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
// import { useAuthStore } from '../store/useAuthStore';
import { useDispatch, useSelector } from 'react-redux';
import { getMyChatPartners,setSelectedUser } from '../chatSlice'; 

const ChatsList = () => {
  // const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const {chats, isUsersLoading} = useSelector(state => state.chat);
  const { onlineUsers } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // console.log("chats: ",chats);

  useEffect(() => {
   dispatch(getMyChatPartners());
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map(chat => (
        <div key={chat._id} className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors' onClick={() => dispatch(setSelectedUser(chat))}>
          {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
          <div className='flex items-center gap-3'>
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : 'offline'}`}>
              <div className='size-12 rounded-full'>
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>
            <h4 className='text-slate-200 font-medium truncate'>{chat.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  )
}

export default ChatsList
