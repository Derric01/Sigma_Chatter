import mongoose from 'mongoose';
//import cloudinary from "../lib/cloudinary.js";
const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        text:{
            type:String,
            
        },        image:{
            type:String
        },
        clientMessageId:{
            type:String,
            index: true // Add an index for faster lookups
        },
    },
    {timestamps:true}
);

const Message = mongoose.model("message",messageSchema);
export default Message;