import React from 'react'

const ChatList = ({chat, onlineUsers, handleFetch}) => {
    return (
        <div key={chat._id} className='bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors' onClick={() => handleFetch(chat)}>
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
            <div className='flex items-center gap-3'>
                <div className={`avatar ${onlineUsers?.includes(chat.participents[0]._id) ? "online" : 'offline'}`}>
                    <div className='size-12 rounded-full'>
                        <img src={chat.participents[0].profilePic || "/avatar.png"} alt={chat.participents[0].fullName} />
                    </div>
                </div>

                <div>
                    <h4 className='text-slate-200 font-medium truncate'>{chat.participents[0].fullName}</h4>
                    <p>{chat.lastMessagePerUser[0].message.text}</p>
                </div>
            </div>
        </div>
    )
}

export default ChatList
