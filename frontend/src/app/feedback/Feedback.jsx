import React from "react";

const feedbacks = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    email: "john.doe@example.com",
    message: "Amazing experience! Loved the UI and smooth interactions.",
    rating: 5,
    time: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    email: "jane.smith@example.com",
    message: "Customer support was super helpful. Quick responses!",
    rating: 4,
    time: "1 day ago",
  },
  {
    id: 3,
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    email: "michael.b@example.com",
    message: "Good service but could improve some features.",
    rating: 3,
    time: "3 days ago",
  },
];

const FeedbackCard = ({ name, avatar, email, message, rating, time }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 border dark:border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:hover:shadow-gray-900">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <img src={avatar} alt={name} className="w-14 h-14 rounded-full border dark:border-gray-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
        </div>
      </div>

      {/* Feedback Message */}
      <p className="text-gray-700 dark:text-gray-300 mt-3 text-sm">{message}</p>

      {/* Rating & Time */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-yellow-500 text-lg">{"⭐".repeat(rating)}</div>
        <span className="text-gray-400">{time}</span>
      </div>
    </div>
  );
};

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">User Feedback</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {feedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} {...feedback} />
        ))}
      </div>
    </div>
  );
};

export default Feedback;
