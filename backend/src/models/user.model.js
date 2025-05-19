import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(  // Fixed "Scheme" to "Schema"
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        fullName:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6
        },
        profilepic:{
            type:String,
            default:"",
        },
    },
    {timestamps:true}
);

const User = mongoose.model("user",userSchema);

export default User;