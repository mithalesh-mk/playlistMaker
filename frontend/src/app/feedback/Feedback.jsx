import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInstance";
import GiveFeedback from "./GiveFeedback";
import { useAuth } from "@/userContext/AuthProvider";


const FeedbackCard = ({ name, avatar, message, rating, time }) => {
  return (
    <motion.div
      className="overflow-hidden p-5 rounded-xl border border-white/20 shadow-lg shadow-blue-500/20
                 backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 
                 hover:scale-105 transition-transform duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      whileHover={{ scale: 1.15 }}
    >
      <div className="flex items-center gap-4">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full border border-white/30" />
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
        </div>
      </div>

      <p className="text-white mt-3 text-sm">{message}</p>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-yellow-400 text-lg">{"⭐".repeat(rating)}</div>
        <span className="text-white/60">{time}</span>
      </div>
    </motion.div>
  );
};

const Feedback = () => {

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const {user} = useAuth();
  const { username, profilePic } = user;

  useEffect(() => {
    const fetchfeedback = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks");
        const data = await response.data;
        console.log(data);
        if (data.success) {
          setFeedbacks(data.data);
        } else {
          setError("Failed to fetch feedback");
        }
      } catch (error) {
        console.log(error);
        setError("Failed to fetch feedback");
      }
      setLoading(false);
    };

    fetchfeedback();
  }, []);

  //console.log("User Name:", username);
  //console.log("User ProfilePic:", profilePic);

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const response = await axiosInstance.post("/feedbacks", feedbackData);
      if (response.data.success) {
        alert("Feedback submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  if (feedbacks.length === 0) return <h1>No
    Feedback
  </h1>;


  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-white mb-6">User Feedback</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
        {feedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} 
            name={feedback.user.username} 
            avatar={feedback.user.profilePic} 
            message={feedback.message} 
            rating={feedback.rating} 
            time={new Date(feedback.createdAt).toDateString()}
          />
        ))}
      </div>
      <div>
        <motion.h1
            className="text-md font-bold text-white mt-12 text-center px-4 py-2 rounded-lg bg-white/10
                        border border-white/30 shadow-md backdrop-blur-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                boxShadow: [
                "0px 0px 10px rgba(255, 255, 255, 0.2)",
                "0px 0px 20px rgba(255, 255, 255, 0.4)",
                "0px 0px 10px rgba(255, 255, 255, 0.2)"
                ] 
            }}
            transition={{ 
                duration: 2, 
                ease: "easeInOut", 
                repeat: Infinity, 
                repeatType: "reverse" 
            }}
            >
            Your feedback is the key to growth! 🌱✨ <br />  
            Share your thoughts and help us improve—every voice matters! 💬🚀
        </motion.h1>
      </div>
      <div className="flex justify-center mt-6">
        <GiveFeedback onSubmit={handleFeedbackSubmit} />
      </div>
        
    </div>
  );
};

export default Feedback;
