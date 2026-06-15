import UsersLoadingSkeleton from '../../users/components/UsersLoadingSkeleton';
import NoChatsFound from './NoChatsFound';
import useChatList from '../hooks/useChatList';
import ChatList from './ChatList';

const ChatsListsContainer = () => {
  const { isChatListLoading, chatLists, onlineUsers, handleFetch } = useChatList();
  // const { user } = useSelector(state => state.auth);

  if (isChatListLoading) return <UsersLoadingSkeleton />;
  if (chatLists?.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatLists?.map(chat => (
        <ChatList key={chat._id} chat={chat} onlineUsers={onlineUsers} handleFetch={handleFetch} />
      ))}
    </>
  )
}

export default ChatsListsContainer
