import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { useAuth } from "@/userContext/AuthProvider";

const GiveFeedback = ({ onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState("");
    const { user } = useAuth();
    const { username, profilePic } = user;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    console.log("User:", username, profilePic);
    console.log("Rating:", rating);
    console.log("Message:", message);
    onSubmit({ rating, message, username, profilePic });
    setRating(0);
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="flex items-center">
      {/* Open Modal Button */}
      <motion.button
        className="bg-black hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg ml-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        Share Your Feedback
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 relative
                 backdrop-blur-2xl bg-white/10 dark:bg-gray-800/20" 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white"
                onClick={() => {setIsOpen(false)
                    setRating(0)
                    setMessage("")
                }}
              >
                <X size={24} />
              </button>

              <h2 className="text-lg font-semibold text-white mb-4 text-center">
                Rate Your Experience
              </h2>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                    key={star}
                    size={32}              
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    fill={star <= rating ? "yellow" : "none"} // Ensures persistent fill
                    stroke = {star <= rating ? "yellow" : "grey"} // Keeps star visible even when not filled
                    className={`cursor-pointer transition-colors ${
                        star <= (hover || rating) ? "text-yellow-400" : "text-gray-500"
                    }`}
                    />
                ))}
              </div>

              {/* Comment Input */}
              <textarea
                className="w-full p-3 rounded-lg border border-white/30 bg-gray-800/40 text-white"
                rows="5"
                placeholder="Write your feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              {/* Submit & Close Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-1 rounded-lg w-full mr-2"
                  onClick={handleSubmit}
                >
                  Submit Feedback
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiveFeedback;
