import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axiosInstance';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '@/userContext/AuthProvider';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { IoSend } from 'react-icons/io5';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState(null);
  const { playlistId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReplies, setShowReplies] = useState({});

  const handleShowReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast({
        description: 'Please enter a comment and rating',
      });
      setError('Please enter a comment and rating');  
      setTimeout(() => { 
        setError(null);
      }
      , 3000);
      return;
    }

    const addedComment = await axiosInstance.post(
      `/comment/addcomment/${playlistId}`,
      {
        text: comment,
        rating: rating,
        userId: user._id,
      }
    );
    const data = await addedComment.data;
    if (!data.success) {
      toast({
        description: data.message,
      });
    } else {
      fetchComments();
      setComment('');
      setRating(0);
    }
  };

  const fetchComments = async () => {
    const comments = await axiosInstance.get(
      `/comment/getcomments/${playlistId}`
    );
    const data = await comments.data;
    console.log(data.data);
    if (!data.success) {
      toast({
        description: data.message,
      });
    } else {
      setComments(data.data);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  console.log(comments);
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = Math.floor((now - createdAt) / 1000); // Difference in seconds

    if (diff < 60) {
      return `${diff} second${diff !== 1 ? 's' : ''} ago`;
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showreplyInput, setShowReplyInput] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleReply = async (commentId) => {
    if (!replyText) {
      toast({
        description: 'Please enter a reply',
      });
      
      return;
    }

    const addedReply = await axiosInstance.post(
      `/comment/addreply/${commentId}`,
      {
        userId: user._id,
        replyText,
      }
    );

    const data = await addedReply.data;
    if (!data.success) {
      toast({
        description: data.message,
      });
    } else {
      fetchComments();
      setReplyText('');
      setShowReplyInput(null);
    }
  };

  return (
    <div className="flex flex-col relative items-center ">
      {/* Comment Input Box */}
      <div className="md:w-[90%] w-full flex justify-center border-b border-gray-300 mx-2 md:mx-7 dark:border-gray-700 pb-6">
        <div className="w-full bg-white flex-col dark:bg-black my-3 relative rounded-2xl p-4 flex items-start space-x-2 shadow-md">
          <div className="pl-[20px]">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={index}
                    className={`cursor-pointer text-xl md:text-3xl ${
                      starValue <= rating ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                    onClick={() => setRating(starValue)}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </div>
          <textarea
            type="text"
            className="w-[80%] mt-2 bg-white scrollbar-hide  dark:bg-black text-gray-600 dark:text-white/80 px-4 py-2 text-md md:text-lg rounded-xl focus:outline-none resize-none"
            rows={3}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength={300}
            placeholder="Add a comment..."
          />
          <button
            onClick={addComment}
            className="bg-primary absolute bottom-4 right-4 dark:bg-white dark:text-black text-white px-2 py-2 rounded-full hover:bg-primary/90 transition-all"
          >
            <IoSend />
          </button>
        {error && (
          <p className=" absolute -bottom-8 text-red-500 text-sm mt-2">{error}</p>
        )}
        </div>
      </div>
      <div className="flex justify-between w-full mt-4">
        <p className="text-xl font-bold">Comments: {comments.length}</p>
        <p className="text-xl font-bold">Most Recent </p>
      </div>

      {/* Comments */}
      <div className="w-full overflow-y-scroll overflow-hidden scrollbar-hide mt-6 space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={comment._id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:w-[90%] w-full mx-auto shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex gap-2 items-start">
                {/* User Image */}
                <img
                  src={comment?.userId?.profilePic || '/default-avatar.png'}
                  alt="user"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 shadow-md"
                />
                

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div>
                      <p className="capitalize font-semibold text-white text-lg">
                        {comment?.userId?.username || 'Unknown User'}
                      </p>
                      <div className="flex items-center">
                        {[...Array(comment?.rating)].map((_, i) => (
                          <span
                            key={i}
                            className="cursor-pointer text-md text-yellow-400 hover:scale-110 transition"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {formatTimeAgo(comment.createdAt)}
                      </p>
                    </div>

                    {/* Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(comment._id)}
                        className="text-gray-400 hover:text-gray-200 transition"
                      >
                        &#8226;&#8226;&#8226;
                      </button>

                      {activeDropdown === comment._id && (
                        <div className="absolute right-0 top-6 bg-gray-800 border border-gray-700 rounded-lg shadow-md w-32 z-10 transition-opacity duration-200">
                          <ul className="text-sm text-gray-300">
                            <li
                              className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition"
                              onClick={() => alert('Edit')}
                            >
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition"
                              onClick={() => alert('Delete')}
                            >
                              Delete
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-700 cursor-pointer transition"
                              onClick={() => alert('Report')}
                            >
                              Report
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-gray-300 mt-2 text-base leading-relaxed">
                    {comment.text}
                  </p>

                  {/* Reply Section */}
                  <div className="flex gap-6 mt-3">
                    <button
                      onClick={() =>
                        setShowReplyInput((prev) =>
                          prev === index ? null : index
                        )
                      }
                      className="text-blue-400 hover:text-blue-500 transition text-sm"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => handleShowReplies(comment._id)}
                      className="text-blue-400 hover:text-blue-500 transition text-sm"
                    >
                      {showReplies[comment._id]
                        ? 'Hide Replies'
                        : 'Show Replies'}
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && showReplies[comment._id] && (
                    <div className="mt-3 space-y-2">
                      {comment.replies.map((reply, idx) => (
                        <div
                          key={idx}
                          className="ml-6 flex justify-start items-center gap-2 border-l-2 border-gray-700 pl-3"
                        >
                          <img
                            src={reply.userId.profilePic}
                            alt="user"
                            className="w-8 h-8 rounded-full object-cover border-2 border-gray-700 shadow-md"
                          />
                          <p className="text-gray-400 text-sm">
                            <span className="font-semibold text-gray-300">
                              {reply.userId.username || 'Unknown User'}
                            </span>{' '}
                            {reply.replyText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {showreplyInput === index && (
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 w-full border border-gray-600"
                      />
                      <button
                        onClick={() => handleReply(comment._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 font-semibold mt-4 text-center">
            No comments yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
