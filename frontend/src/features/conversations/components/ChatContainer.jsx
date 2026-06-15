import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "../../messages/components/MessageInput";
import MessagesLoadingSkeleton from "../../messages/components/MessagesLoadingSkeleton";
import Message from "../../messages/components/Message";
import useChatContainer from "../hooks/useChatContainer";


function ChatContainer() {
  const { user, containerRef, messages, isMessagesLoading, selectedUser } = useChatContainer();

  return (
    <>
      <ChatHeader />
      <div ref={containerRef} className="flex-1 px-6 overflow-y-auto py-8">
        {
          messages?.length > 0 && !isMessagesLoading ?
            (
              <div className="max-w-3xl mx-auto space-y-6">
                {
                  messages.map((msg) => (
                     <Message key={msg?._id} msg={msg} user={user} />
                  ))
                }

                {/* 👇 scroll target */}
                {/* <div  className={messageSendingLoading ? `chat chat-end animate-pulse` : ''} >
                  {
                    messageSendingLoading
                    &&
                    <div className={`chat-bubble bg-slate-800 text-white w-32`} />
                  }
                </div> */}
              </div>
            )
            :
            isMessagesLoading ?
              (
                <MessagesLoadingSkeleton />
              )
              :
              (
                <NoChatHistoryPlaceholder name={selectedUser.fullName} />
              )
        }
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;