import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, MessageCircle, Send, X, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function HelpCenter() {
  const [openTopic, setOpenTopic] = useState(null);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [showEngageModal, setShowEngageModal] = useState(false);
  const [showSharePlaylist, setShowSharePlaylist] = useState(false);
  const [showManagePlaylists, setShowManagePlaylists] = useState(false);
  const [question, setQuestion] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const topics = [
    { id: 1, title: "Create and manage playlists", content: "Learn how to create, edit, delete, and share playlists." },
    { id: 2, title: "How to share a playlist", content: "Click the share button and copy the link to send it to others." },
    { id: 3, title: "Engage with Playlists", content: "Discover how to like, comment, and bookmark playlists." },
    { id: 4, title: "Troubleshooting common issues", content: "Find solutions to common problems you might encounter." },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your question has been submitted 🎉",
      variant: "success",
      duration: 3000,
    });

    setQuestion("");
    setDetails("");
    setImage(null);
    setShowCommunityForm(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: "Please upload a valid image file.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="h-full xl:h-[calc(100vh-70px)] flex flex-col items-center p-6 text-white">
      {/* Header */}
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        Help Center
      </motion.h1>

      {/* Help Topics */}
      <motion.div 
        className="mt-6 w-full max-w-3xl bg-gray-900 border border-gray-800 shadow-lg p-6 rounded-xl" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4">Popular Help Topics</h3>
        <div className="space-y-3">
          {topics.map((topic) => (
            <div key={topic.id} className="border-b border-gray-700 pb-2">
              <button 
                className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-gray-800 transition-all" 
                onClick={() => {
                  if (topic.id === 3 ) {
                      setShowEngageModal(true);
                    
                  } 
                  else if (topic.id === 4) {
                      setShowTroubleshooting(true);
                  }
                  else if (topic.id === 2) {
                      setShowSharePlaylist(true);
                  }
                  else if (topic.id === 1) {
                      setShowManagePlaylists(true);
                  }
                  else {
                    setOpenTopic(openTopic === topic.id ? null : topic.id);
                  }
                }}
              >
                <span className="text-sm font-medium">{topic.title}</span>
                {openTopic === topic.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {openTopic === topic.id && (
                <motion.p 
                  className="text-gray-400 text-sm mt-2" 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  transition={{ duration: 0.3 }}
                >
                  {topic.content}
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* "Need More Help?" Section */}
      <motion.div 
        className="mt-6 w-full max-w-3xl bg-gray-900 border border-gray-800 shadow-lg p-6 rounded-xl flex flex-col items-center" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-4">Need More Help?</h3>
        <button className="flex items-center gap-2 text-blue-400 text-sm hover:underline mt-2" onClick={() => setShowCommunityForm(true)}>
          <MessageCircle size={16} /> Ask the Help Community
        </button>

        <button onClick={() => navigate("/feedback")} className="flex items-center gap-2 text-blue-400 text-sm hover:underline mt-2">
          <Send size={16} /> Give Feedback
        </button>
      </motion.div>

      {/* Help Community Form */}
      <AnimatePresence>
        {showCommunityForm && (
          <motion.div className="sm:overflow-auto fixed inset-0 flex items-center justify-center z-50 p-2 bg-black/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 p-6 rounded-xl shadow-lg w-96 relative border border-gray-800" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }}>
              <button className="absolute top-4 right-4 text-white" onClick={() => setShowCommunityForm(false)}>
                <X size={24} />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">Ask the Help Community</h2>

              <form onSubmit={handleSubmit}>
                <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Title of your community question..." className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white mb-3" required />
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Explain your issue..." className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white" rows="4" required></textarea>

                {image && <img src={image} alt="Preview" className="mt-3 max-w-full rounded-lg" />}
                <label className="cursor-pointer flex items-center gap-2 text-white/70 hover:text-white mt-3">
                  <ImageIcon size={20} />
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>

                <button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full">
                  Submit Question
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Troubleshooting Modal */}
            <AnimatePresence>
        {showTroubleshooting && (
          <motion.div className="sm:overflow-auto fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 p-8 rounded-xl shadow-lg w-[450px] relative border border-gray-800" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }}>
              <button className="absolute top-4 right-4 text-white" onClick={() => setShowTroubleshooting(false)}>
                <X size={24} />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">Troubleshooting & FAQs</h2>
              <div className="text-gray-300 text-sm space-y-4">
                <div><h3 className="font-semibold text-white">Didn’t Receive OTP?</h3><ul className="list-disc ml-6"><li>Check spam/junk folder.</li><li>Wait 60 seconds & request a new OTP.</li><li>Ensure email is correct.</li></ul></div>
                <div><h3 className="font-semibold text-white">Can’t Log In?</h3><ul className="list-disc ml-6"><li>Check email & password.</li><li>Reset password.</li><li>Contact support.</li></ul></div>
                <div><h3 className="font-semibold text-white">Playlist Not Saving?</h3><ul className="list-disc ml-6"><li>Check internet connection.</li><li>Refresh & try again.</li><li>Fill required fields.</li></ul></div>
                <div><h3 className="font-semibold text-white">Sharing Issues?</h3><ul className="list-disc ml-6"><li>Ensure correct link.</li><li>Re-share playlist.</li><li>Contact support.</li></ul></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Engage with Playlists Modal */}
      <AnimatePresence>
        {showEngageModal && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 p-8 rounded-xl shadow-lg w-[450px] relative border border-gray-800" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }}>
              <button className="absolute top-4 right-4 text-white" onClick={() => setShowEngageModal(false)}>
                <X size={24} />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">Engage with Playlists</h2>
              <div className="text-gray-300 text-sm space-y-4">
                <div>
                  <h3 className="font-semibold text-white">How to Like a Playlist?</h3>
                  <ul className="list-disc ml-6">
                    <li>Liking a playlist saves it to your favorites for easy access later.</li>
                    <li>Open a playlist you enjoy.</li>
                    <li>Click the "Like" ❤️ button.</li>
                    <li>The playlist will now appear under "Liked Playlists" in your profile.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white">How to Comment on a Playlist?</h3>
                  <ul className="list-disc ml-6">
                    <li>You can share your thoughts on a playlist by commenting.</li>
                    <li>Scroll down to the comments section of the playlist.</li>
                    <li>Type your comment in the text box.</li>
                    <li>Click "Post."</li>
                    <li>Your comment will be visible to others, and they can reply.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-white">How to Reply to Comments?</h3>
                  <ul className="list-disc ml-6">
                    <li>Find a comment you want to reply to.</li>
                    <li>Click the "Reply" button under the comment.</li>
                    <li>Type your reply and hit "Post."</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Share Playlist Modal */}
      <AnimatePresence>
        {showSharePlaylist && (
          <motion.div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-900 p-8 rounded-xl shadow-lg w-[450px] relative border border-gray-800" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ duration: 0.3 }}>
              <button className="absolute top-4 right-4 text-white" onClick={() => setShowSharePlaylist(false)}>
                <X size={24} />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">How to Share a Playlist?</h2>
              <div className="text-gray-300 text-sm space-y-4">
                <div>
                  <h3 className="font-semibold text-white">Sharing a playlist lets others enjoy your collection. Follow these steps:</h3>
                  <ul className="list-disc ml-6 mt-2">
                    <li>Open the Playlist.</li>
                    <li>Go to "My Playlists" and select the playlist you want to share.</li>
                    <li>Click the "Share" Button.</li>
                    <li>You’ll see sharing options available.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Choose a Sharing Option:</h3>
                  <ul className="list-disc ml-6 mt-2">
                    <li><strong>Copy Link</strong> – Get a direct link to share manually.</li>
                    <li><strong>Social Media</strong> – Share directly to Facebook, Twitter, WhatsApp, etc.</li>
                    <li><strong>Embed Code</strong> – Copy an embed code to use on websites.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Who Can View My Shared Playlists?</h3>
                  <p className="ml-6">Anyone with the link can view your shared playlist.</p>
                  <p className="ml-6">If privacy settings are introduced in the future, you may be able to restrict access.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white">Can I Collaborate on a Playlist?</h3>
                  <p className="ml-6">🚀 (Feature Coming Soon!)</p>
                  <p className="ml-6">Soon, you’ll be able to invite others to add songs and manage playlists together.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
  {showManagePlaylists && (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-md" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-900 p-8 lg:h-auto h-[80vh] overflow-auto scrollbar-hide rounded-xl shadow-lg w-[450px] relative border border-gray-800" 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: 50, opacity: 0 }} 
        transition={{ duration: 0.3 }}
      >
        <button className="absolute top-4 right-4 text-white" onClick={() => setShowManagePlaylists(false)}>
          <X size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-center">How to Create and Manage Playlists</h2>
        <div className="text-gray-300 text-sm space-y-4">

          <div>
            <h3 className="font-semibold text-white">How to Create a Playlist?</h3>
            <ul className="list-disc ml-6 mt-2">
              <li>Click on the "Create Playlist" button.</li>
              <li>This button is usually located on the homepage or in your profile section.</li>
              <li>Enter Playlist Details:</li>
              <ul className="list-disc ml-6">
                <li>Add a title (e.g., "Chill Vibes" or "Workout Mix").</li>
                <li>Provide a description (optional) to give more context.</li>
                <li>Upload a cover image (if applicable) to personalize your playlist.</li>
              </ul>
              <li>Click "Save" to create the playlist.</li>
              <li>Once saved, the playlist will appear in your profile, ready for songs to be added.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">How to Add Songs to a Playlist?</h3>
            <ul className="list-disc ml-6 mt-2">
              <li>Open the Playlist.</li>
              <li>Go to "My Playlists" and select the one you want to modify.</li>
              <li>Click on "Add Songs."</li>
              <li>Use the search bar to find the song you want to add.</li>
              <li>Click "Add" to immediately add the song to your playlist.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white">How to Edit or Delete a Playlist?</h3>
            <h4 className="font-medium text-white mt-2">Editing a Playlist</h4>
            <ul className="list-disc ml-6">
              <li>Open the playlist you want to edit.</li>
              <li>Click the "Edit" button.</li>
              <li>Modify the title, description, or cover image as needed.</li>
              <li>Click "Save" to update the changes.</li>
            </ul>
            <h4 className="font-medium text-white mt-2">Deleting a Playlist</h4>
            <ul className="list-disc ml-6">
              <li>Open the playlist.</li>
              <li>Click the "Delete" button.</li>
              <li>Confirm your action.</li>
              <li className="text-red-400">⚠ Note: Once deleted, the playlist cannot be recovered.</li>
            </ul>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </div>
  );
}



