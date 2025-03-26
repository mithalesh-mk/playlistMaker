import React, { useEffect, useState } from 'react';
import axiosInstance from '@/axiosInstance';
import Rating from 'react-rating';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAuth } from '@/userContext/AuthProvider';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const { playlistId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast({
        description: 'Please enter a comment and rating',
      });
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

    const addedReply = await axiosInstance.post(`/comment/addreply/${commentId}`, {
      userId: user._id,
      replyText,
    });

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
    <div className="bg-muted rounded-3xl mx-auto w-[95%] mt-16 sm:w-[85%] lg:w-[87%] p-6 flex flex-col items-center">
      {/* Comment Input Box */}
      <div className="w-[90%] flex justify-center border-b border-gray-300 mx-7 dark:border-gray-700 pb-6">
        <div className="w-full bg-white flex-col dark:bg-black my-3 relative rounded-2xl p-4 flex items-start space-x-2 shadow-md">
          <div className="pl-[20px]">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <span
                    key={index}
                    className={`cursor-pointer text-3xl ${
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
            className="w-[80%] mt-2 bg-white scrollbar-hide  dark:bg-black text-gray-600 dark:text-white/80 px-4 py-2 text-lg rounded-xl focus:outline-none resize-none"
            rows={3}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            maxLength={300}
            placeholder="Add a comment..."
          />
          <button
            onClick={addComment}
            className="bg-primary absolute bottom-4 right-4 dark:bg-white dark:text-black text-white px-5 py-2 rounded-xl hover:bg-primary/90 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex justify-between w-full mt-4">
        <p className="text-xl font-bold">Comments: {comments.length}</p>
        <p className="text-xl font-bold">Most Recent </p>
      </div>

      {/* Comments */}
      <div className="w-full">
        {comments && comments.length > 0 ? (
          comments.map((comment,index) => (
            <div key={comment._id} className="w-[90%] mx-auto mt-6">
              <div className="flex gap-4 items-start">
                {/* User Image */}
                <div className="flex-shrink-0">
                  <img
                    src={comment?.userId?.profilePic || '/default-avatar.png'}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex  gap-4 items-center">
                      <p className="capitalize font-semibold text-lg">
                        {comment?.userId?.username || 'Unknown User'}
                      </p>
                      <div className="flex items-center justify-center space space-x-0">
                        {[...Array(comment?.rating)].map((_, index) => {
                          return (
                            <span
                              key={index}
                              className={`cursor-pointer text-md 
                                
                                  text-yellow-400
                                  
                              `}
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {formatTimeAgo(comment.createdAt)}
                      </p>
                    </div>

                    {/* Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => handleDropdownToggle(comment._id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        &#8226;&#8226;&#8226;
                      </button>

                      {activeDropdown === comment._id && (
                        <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                          <ul className="text-sm text-gray-700 dark:text-gray-300">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => alert('Edit')}
                            >
                              Edit
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              onClick={() => alert('Delete')}
                            >
                              Delete
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
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
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-base">
                    {comment.text}
                  </p>

                  {/* Reply Button */}
                  <div className="flex gap-6 mt-2">
                    {/* Reply Button */}
                    <button
                      onClick={() => setShowReplyInput((prev) => (prev === index ? null : index))}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Reply
                    </button>
                    <button
                      
                      className="text-blue-500 hover:underline text-sm"
                    >
                      show reply
                    </button>

                    {/* Replies */}
                    {comment.replies.length > 0 && comment.replies.map((reply, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <p className="text-gray-500 text-sm">
                          {reply.userId.username || 'Unknown User'}
                        </p>
                        <p className="text-gray-500 text-sm">{reply.replyText}</p>
                      </div>
                    ))}


                    {/* Reply Input */}

                    {showreplyInput===index && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none border border-gray-600 w-[250px]"
                        />
                        <button onClick={() => handleReply(comment._id)} className="bg-slate-700 text-white px-4 py-1 rounded-lg hover:bg-slate-900 transition-all">
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg font-semibold mt-4">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
