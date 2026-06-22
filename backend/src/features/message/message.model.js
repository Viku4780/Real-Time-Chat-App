import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        trim: true,
        maxLength: 2000
    },
    image: {
        type: String,
    },
    video: {
        type: String
    },
    documentFile: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "sent", "delivered", "seen", "failed"],
        default: "pending"
    },
    // messageDeletedFor: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'User'
    //     }
    // ], // this is perfect for if someone deleted the message they are not going to see it
    // isActive: {
    //     type: Boolean,
    //     default: true
    // },    // this becomes un-neccessary when using the client side database to store the message
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;