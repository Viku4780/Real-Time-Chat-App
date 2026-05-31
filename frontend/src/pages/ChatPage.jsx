import BorderAnimatedContainer from '../shared/components/BorderAnimatedContainer';
import ProfileHeader from '../features/users/components/ProfileHeader';
import ActiveTabSwitch from '../features/chat/components/ActiveTabSwitch';
import ChatsList from '../features/chat/components/ChatsList';
import ContactList from '../features/chat/components/ContactList';
import ChatContainer from '../features/chat/components/ChatContainer';
import NoConversationPlaceholder from '../features/chat/components/NoConversationPlaceholder';
import { useSelector } from 'react-redux';


const ChatPage = () => {
 const {activeTab, selectedUser} = useSelector(state => state.chat);

//  console.log("selectedUser: ", selectedUser);

  return (
    <div className='relative w-full max-w-6xl h-[800px]'>
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className='flex-1 overflow-y-auto p-4 space-y-2'>
            {activeTab === 'chats' ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
         {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage;
