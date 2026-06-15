import React from 'react'
import { formateDateTime } from '../../../utils/formateDateTime'

const ChatList = ({chat, onlineUsers, handleFetch}) => {
    return (
        <div key={chat._id} className='bg-cyan-500/10 p-3 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors' onClick={() => handleFetch(chat)}>
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
            <div className='flex items-center gap-3'>
                <div className={`avatar ${onlineUsers?.includes(chat.participents[0]._id) ? "online" : 'offline'}`}>
                    <div className='size-12 rounded-full'>
                        <img src={chat.participents[0].profilePic || "/avatar.png"} alt={chat.participents[0].fullName} />
                    </div>
                </div>

                <div className='min-w-0' >
                    <h4 className='text-slate-200 font-medium truncate'>{chat.participents[0].fullName}</h4>
                    <p className=' truncate'>{chat.lastMessagePerUser[0].message.text}</p>
                </div>

                <div className=' ml-auto shrink-0 flex flex-col items-center justify-between h-12'>
                    <p className='text-[10px] w-12'>{formateDateTime(chat)}</p>
                    {
                        chat.unReadCountPerUser[0].count > 0 ? <p className='text-xs bg-cyan-500/50 w-4 h-4 rounded-full text-center '>{ chat.unReadCountPerUser[0].count}</p> : null
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default ChatList
