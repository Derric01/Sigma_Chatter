import React, { useState } from 'react';
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, AlertCircle } from "lucide-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const { sendMessage, isMessageSending, selectedUser } = useChatStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);
    
    if ((!message.trim() && !imageFile) || isMessageSending) return;
    
    // Validate recipient
    if (!selectedUser || !selectedUser._id) {
      setUploadError("No recipient selected. Please select a user to chat with.");
      return;
    }
    
    try {
      // Generate a unique client ID for this message to help prevent duplicates
      const clientMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      console.log("Submitting message with image:", !!imageFile, "clientMessageId:", clientMessageId);
      
      // Show progress for large images
      if (imageFile && imageFile.size > 1024 * 1024) { // > 1MB
        // Display image size in the log instead of calculating unused progressPercent
        console.log(`Sending large image (${(imageFile.size / (1024 * 1024)).toFixed(1)}MB)`);
      }
      
      const result = await sendMessage(message, imageFile, selectedUser._id, clientMessageId);
      
      if (result) {
        setMessage("");
        setImageFile(null);
        setImagePreview(null);
      } else {
        // If sendMessage returned null, there was an error
        setUploadError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setUploadError(error.message || "Failed to send message. Please try again.");
    }
  };
  const handleImageChange = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image too large! Maximum size is 5MB.");
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setUploadError("Invalid file type. Please use JPG, PNG or GIF.");
        return;
      }
      
      // Log file information for debugging
      console.log(`Selected image: ${file.name}, ${(file.size / 1024).toFixed(1)}KB, type: ${file.type}`);
      
      setUploadError(null);
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        try {
          setImagePreview(reader.result);
        } catch (error) {
          console.error("Error setting image preview:", error);
          setUploadError("Error processing image. Please try another.");
        }
      };
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        setUploadError("Error reading file. Please try another image.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling image selection:", error);
      setUploadError("Failed to process image. Please try again.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-base-300">
      {imagePreview && (
        <div className="relative w-24 h-24 mb-2">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-md"
          />
          <button
            type="button"
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
            onClick={removeImage}
          >
            ✕
          </button>
        </div>
      )}
      
      {uploadError && (
        <div className="flex items-center gap-2 mb-2 text-red-500">
          <AlertCircle className="size-5" />
          <span className="text-sm">{uploadError}</span>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <Image className="size-6 text-base-content/70" />
        </label>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 input input-bordered"
        />
        
        <button 
          type="submit" 
          className={`btn btn-primary btn-circle ${isMessageSending ? "loading" : ""}`}
          disabled={(!message.trim() && !imageFile) || isMessageSending}
        >
          <Send className="size-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
