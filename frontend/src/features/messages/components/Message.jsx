import React from 'react'
import { formateDateTime } from '../../../utils/formateDateTime'

const Message = ({ msg, user }) => {
  return (
    <div
      key={msg._id}
      className={`chat ${msg?.senderId === user._id ? "chat-end" : "chat-start"}`}
    >
      <div
        className={`chat-bubble relative ${msg?.senderId === user._id
          ? "bg-cyan-600/50 text-white"
          : "bg-slate-800 text-slate-200"
          }`}
      >
        {msg?.image && (
          <img src={msg?.image} alt="Shared" className="rounded-lg h-48 object-cover" />
        )}
        {msg?.text && <p className="mt-2">{msg?.text}</p>}

        <div className='flex items-center gap-5'>
          <p className="text-xs mt-1 opacity-75 flex items-center ">
            {formateDateTime(msg)}
          </p>
          <p>{
            msg?.status === 'pending' ?
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              :
              msg?.status === 'sent' ?
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A9599" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                :
                msg?.status === 'delivered' ?
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A9599" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 6 7 17 2 12"></polyline>
                    <polyline points="22 6 11 17 6 12"></polyline>
                  </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#44BEE2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 6 7 17 2 12"></polyline>
                    <polyline points="22 6 11 17 6 12"></polyline>
                  </svg>
          }</p>
        </div>

      </div>
    </div>
  )
}

export default Message
