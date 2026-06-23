import { db } from "../config/indexedDB.js";

const createMessage = async(msgData) => {
  const msgId = await db.messages.add(msgData);
  return msgId;
}

const getAllMessagesByConversationId = async(conversationId) => {
  const messages =  await db.messages
                          .where("conversationId")
                          .equals(conversationId)
                          .reverse() // this puts the newest at the top
                          .toArray();

  return messages;
}

const getMessageById = async(msgId) => {
  const message = await db.messages
                          .where("_id")
                          .equals(msgId);
  
  return message;
}

const updateMessage = async(msgId) => {
  
}


const deleteMessage = async(msgId) => {

}

const deleteConversation = async(conversationId) => {

}

const updateUnreadCount = async(conversationId) => {

}


export {createMessage, getAllMessagesByConversationId, getMessageById, updateMessage, deleteMessage, deleteConversation, updateUnreadCount};