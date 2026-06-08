import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "../../messages/components/MessageInput";
import MessagesLoadingSkeleton from "../../messages/components/MessagesLoadingSkeleton";
import Message from "../../messages/components/Message";
import useChatContainer from "../hooks/useChatContainer";


function ChatContainer() {
  const {user, messageEndRef, messages, isMessagesLoading, selectedUser} = useChatContainer();

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <Message msg={msg} user={user} />
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;