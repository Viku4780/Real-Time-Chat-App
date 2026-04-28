import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { unsubscribeFromMessages ,getMessagesByUserId} from "../store/slices/chatSlice";
import { useSocket } from "../hooks/SocketContext";

function ChatContainer() {

  const socket = useSocket();

  const {selectedUser, isMessagesLoading, messages} = useSelector(state => state.chat);
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);
  const messageEndRef = useRef(null);

  useEffect(() => {
    dispatch(getMessagesByUserId(selectedUser._id));

    // clean up
    return () => dispatch(unsubscribeFromMessages({socket}));
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg?.senderId === user._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg?.senderId === user._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg?.image && (
                    <img src={msg?.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg?.text && <p className="mt-2">{msg?.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg?.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
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