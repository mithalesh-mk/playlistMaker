import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/axiosInstance";
import GiveFeedback from "./GiveFeedback";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/userContext/AuthProvider';

const FeedbackCard = ({ name, avatar, message, rating, time }) => {
  return (
    <motion.div
      className="overflow-hidden p-5 rounded-xl border border-white/20 shadow-lg shadow-blue-500/20 backdrop-blur-lg bg-white/10 dark:bg-gray-800/20 hover:scale-105 transition-transform duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      whileHover={{ scale: 1.15 }}
    >
      <div className="flex items-center gap-4">
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full border border-white/30" />
        <h3 className="text-lg font-semibold text-white">{name}</h3>
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
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState(0);
  const user = useAuth();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks");
        if (response.data.success) {
          setFeedbacks(response.data.data);
        } else {
          console.error("Failed to fetch feedback");
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchFeedback();
  }, [feedbacks]);

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const response = await axiosInstance.post("/feedbacks", feedbackData);
      if (response.data.success) {
        toast({ description: "Feedback submitted successfully, thank you!" });
        setFeedbacks((prev) => [response.data.data, ...prev]);
      }
    } catch (error) {
      toast({ description: "Failed to submit feedback, please try again!" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-white mb-6">User Feedback</h1>
      {feedbacks.length === 0 ? (
        <h1 className="text-white text-xl">No Feedback Yet</h1>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
            {feedbacks
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 8)
              .map((feedback) => (
                <FeedbackCard
                  key={feedback._id}
                  name={feedback.user.username}
                  avatar={feedback.user.profilePic}
                  message={feedback.message}
                  rating={feedback.rating}
                  time={new Date(feedback.createdAt).toDateString()}
                />
              ))}
          </div>
          <button
            className="text-white underline mt-4 cursor-pointer"
            onClick={() => setShowAll(true)}
          >
            See All
          </button>
        </>
      )}
      {showAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-lg max-w-4xl w-full h-[80vh] overflow-y-auto relative">
            <h2 className="text-white text-xl font-bold mb-4">All Feedbacks</h2>
            <button className="text-white absolute top-4 right-4" onClick={() => setShowAll(false)}>✖</button>
            <div className="flex gap-2 mb-4">
              {[0, 1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`px-3 py-1 rounded-lg text-white border ${filter === star ? 'bg-yellow-500' : 'bg-gray-700'}`}
                  onClick={() => setFilter(star)}
                >
                  {star === 0 ? "All" : `${star} ⭐`}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {feedbacks
                .filter((feedback) => (filter === 0 ? true : feedback.rating === filter))
                .map((feedback) => (
                  <FeedbackCard
                    key={feedback._id}
                    name={feedback.user.username}
                    avatar={feedback.user.profilePic}
                    message={feedback.message}
                    rating={feedback.rating}
                    time={new Date(feedback.createdAt).toDateString()}
                  />
                ))}
            </div>
          </div>
        </div>
      )}

      {
        !showAll && (
          <motion.h1
            className="text-md font-bold text-white mt-12 text-center px-4 py-2 rounded-lg bg-white/10 border border-white/30 shadow-md backdrop-blur-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              boxShadow: [
                "0px 0px 10px rgba(255, 255, 255, 0.2)",
                "0px 0px 20px rgba(255, 255, 255, 0.4)",
                "0px 0px 10px rgba(255, 255, 255, 0.2)",
              ],
            }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            Your feedback is the key to growth! 🌱✨ <br />
            Share your thoughts and help us improve—every voice matters! 💬🚀
          </motion.h1>

        )
      }

      
      <div className="flex justify-center mt-6">
        <GiveFeedback onSubmit={handleFeedbackSubmit} />
      </div>
    </div>
  );
};

export default Feedback;