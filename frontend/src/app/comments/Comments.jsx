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

  console.log(comments)

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
        <p className="text-xl font-bold">Comments: 69</p>
        <p className="text-xl font-bold">Most Recent </p>
      </div>

      {/* Comments */}
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="w-[90%] mx-auto mt-6">
            <div className="flex gap-4 ">
              <div>
                <img
                  src="https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/x7w6y5fxjqlu2ymtciqb.png"
                  alt="user"
                  className="w-32"
                />
              </div>
              <div className="">
                <div className="flex gap-4 items-center">
                  <p className="capitalize font-semibold text-xl">username</p>
                  <p className="font-semibold text-md">59 minutes ago</p>
                </div>
                <div className="text-black/80 dark:text-white/80 text-base">
                  {comment.text}
                </div>
              </div>
            </div>
            <div className="flex gap-10 items-center ml-[70px]">
              <p className="text-white/80 text-base cursor-pointer">Reply</p>
              <p>...</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-lg font-semibold mt-4">No comments yet</p>
      )}
    </div>
  );
};

export default Comments;
