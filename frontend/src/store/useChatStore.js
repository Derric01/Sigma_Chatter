import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
import socket from '../lib/socket.js';
import { handleApiError } from '../lib/errorHandling.js';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isLoading: false,
  isMessageSending: false,
  
  // Set the selected user for chat
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
  // Get all users for the sidebar
  getUsers: async () => {
    // Skip if we're already loading
    if (get().isUserLoading) return;
    
    set({ isUserLoading: true });
    try {
      // Make sure we're authenticated before making the request
      const authStore = window.authStore;
      if (!authStore?.authUser?._id) {
        console.log('Not authenticated yet, skipping user fetch');
        set({ isUserLoading: false });
        return;
      }
      
      // We'll use a debounced log to avoid console spam
      console.log('Fetching users...');
      const res = await axiosInstance.get("/messages/users");
      
      // Compare with existing data to avoid unnecessary updates
      const currentUsers = get().users;
      const newUsers = res.data;
      
      if (JSON.stringify(currentUsers) !== JSON.stringify(newUsers)) {
        console.log(`Users updated (${newUsers.length})`);
        set({ users: newUsers });
      } else {
        console.log('Users unchanged, skipping update');
      }
    } catch (error) {
      // Use our utility for standardized error handling
      handleApiError(error, "fetching users", {
        statusHandlers: {
          401: () => ({
            message: "Session expired. Please log in again."
          }),
          403: () => ({
            message: "You don't have permission to access the user list."
          })
        }
      });
    } finally {
      set({ isUserLoading: false });
    }
  },
  
  // Get messages for a specific user
  getMessages: async (userId) => {
    set({ isLoading: true });
    try {
      if (!userId) {
        console.error("Invalid userId provided to getMessages:", userId);
        toast.error("Cannot load messages: Invalid user selected");
        set({ isLoading: false });
        return;
      }
      
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      // Use our utility for standardized error handling
      handleApiError(error, "fetching messages", {
        statusHandlers: {
          400: () => ({
            message: "Invalid request. Please try selecting the user again."
          }),
          401: () => ({
            message: "Session expired. Please log in again."
          }),
          403: () => ({
            message: "You don't have permission to view these messages."
          }),
          404: () => ({
            message: "No conversation found with this user."
          })
        }
      });
    } finally {
      set({ isLoading: false });
    }
  },
    // Send a new message
  sendMessage: async (text, imageFile, receiverId, clientMessageId = null) => {
    set({ isMessageSending: true });
    try {
      // Validate inputs
      if (!receiverId) {
        toast.error("Cannot send message: No recipient selected");
        return null;
      }
      
      if (!text && !imageFile) {
        toast.error("Please provide a message or image to send");
        return null;
      }
      
      // If no clientMessageId was provided, generate one
      clientMessageId = clientMessageId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        console.log("Sending message:", { text, hasImage: !!imageFile, receiverId, clientMessageId });
      
      // Create form data to handle both text and image
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (imageFile) formData.append("image", imageFile);
      formData.append("clientMessageId", clientMessageId);
      
      // Log form data contents (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'image' ? 'Image file' : pair[1]));
      }
      
      // Use correct API endpoint with the receiverId
      const res = await axiosInstance.post(`/messages/${receiverId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
        // Extract the new message from the response
      const newMessage = res.data.newMessage || res.data;
      
      // Log successful message send
      console.log("Message sent successfully:", res.data.message || "Success");// Add the new message to the state - this message comes directly from our API call
      set((state) => ({ 
        messages: [...state.messages, newMessage] 
      }));
      
      // Generate a client ID for this message to prevent duplicates
      newMessage._clientId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      // Log message details for debugging
      console.log("Sending message to socket with client ID:", newMessage._clientId);
      
      // Emit the message via socket for real-time updates to other users
      socket.emit("newMessage", newMessage);
      
      return newMessage;
    } catch (error) {
      // Use our utility for standardized error handling with custom status handlers
      handleApiError(error, "sending message", {
        statusHandlers: {
          400: (response) => ({
            message: response.data?.message || "Invalid message format. Please check your input."
          }),
          401: () => ({
            message: "Authentication required. Please log in again."
          }),
          403: () => ({
            message: "You don't have permission to send this message."
          }),
          413: () => ({
            message: "The image file is too large. Please use a smaller image (max 2MB).",
            details: { field: "image" }
          })
        }
      });
      
      return null;
    } finally {
      set({ isMessageSending: false });
    }
  },
    // Socket related functions with improved error handling
  subscribeToMessages: () => {
    // Listen for new messages with comprehensive error handling
    socket.on("newMessage", (message) => {
      try {
        const { selectedUser } = get();
        const state = get();
        
        if (!message) {
          console.error("Received empty message from socket");
          return;
        }
        
        console.log("Received message from socket:", message._id || 'no ID');
        
        // Check if this message is from the current user - we already added it to state in sendMessage
        const authUser = window.authStore?.authUser;
        const isFromCurrentUser = authUser && message.senderId === authUser._id;
        
        // If the message is from the current user, we already added it when sending
        if (isFromCurrentUser) {
          console.log("Ignoring socket echo of our own message");
          return;
        }
        
        // Improved duplicate detection
        const isDuplicate = state.messages.some(m => 
          // Check by ID (most reliable)
          (m._id && message._id && m._id === message._id) ||
          // Check by client ID if available
          (m._clientId && message._clientId && m._clientId === message._clientId) ||
          // Check by content signature
          (m.senderId === message.senderId && 
           m.receiverId === message.receiverId && 
           m.text === message.text &&
           m.image === message.image)
        );
        
        if (isDuplicate) {
          console.log("Preventing duplicate message:", message._id || message._clientId);
          return;
        }
        
        // Only add the message if it's from the currently selected user conversation
        if (selectedUser && (message.senderId === selectedUser._id || message.receiverId === selectedUser._id)) {
          set((state) => ({ 
            messages: [...state.messages, message]
          }));
        }
        
        // If the message is not in the current chat, show a notification
        if (!selectedUser || (selectedUser && message.senderId !== selectedUser._id)) {
          toast.success(`New message from ${message.senderName || 'Someone'}`);
        }
      } catch (error) {
        console.error("Error processing socket message:", error);
      }
    });
    
    // Listen for online users updates
    socket.on("onlineUsers", (users) => {
      try {
        // We'll handle this in App.jsx with a separate listener
        console.log("Received online users update:", users?.length || 0);
      } catch (error) {
        console.error("Error handling online users:", error);
      }
    });
  },
  
  unsubscribeFromMessages: () => {
    socket.off("newMessage");
    socket.off("onlineUsers");
  }
}));
