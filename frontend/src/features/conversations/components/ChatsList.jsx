import UsersLoadingSkeleton from '../../users/components/UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
import {setSelectedUser } from '../chatSlice'; 
import useChatList from '../hooks/useChatList';

const ChatsList = () => {
 const {isUsersLoading, chats, onlineUsers, dispatch} = useChatList();

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
