import { useState, useEffect, use } from 'react';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/userContext/AuthProvider';
import { X } from "lucide-react";
import { motion } from "framer-motion";


const avatars = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/x7w6y5fxjqlu2ymtciqb.png',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/b5ncqfgyzqj99sojluem.png',
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907671/youtubePlaylist/Avatars/qlf2vn3jmfnrllb9gt80.png',
  },
  {
    id: 4,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/wcsgbajwbiujtrudbzvv.png',
  },
  {
    id: 5,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/li7nxwav5fxk61brwov0.png',
  },
  {
    id: 6,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/j9xmgnypfrqowmcsjrn0.png',
  },
  {
    id: 7,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907670/youtubePlaylist/Avatars/tdvwnsfjswazyxs41jhy.png',
  },
  {
    id: 8,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907669/youtubePlaylist/Avatars/wrihbw3svxvoruupbd8x.png',
  },
  {
    id: 9,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907669/youtubePlaylist/Avatars/ellzoi4mvk5bld8avgr2.png',
  },
  {
    id: 10,
    url: 'https://res.cloudinary.com/dtb51hq4c/image/upload/v1739907669/youtubePlaylist/Avatars/dfhan9doi2lte84unfgm.png',
  },
];

export default function ChooseAvatar({isOpenAvatar, setIsOpenAvatar}) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();
  const {user, setUser} = useAuth()
  
  const togglePopup = () => setIsOpen(!isOpenAvatar);

 
  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/select-avatar', { 
        avatar: selectedAvatar, 
        id: user._id 
      });
  
      const data = res.data;
      if (data.success) {
        console.log('Avatar selected successfully!');
        
        // Update user in context
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: selectedAvatar, // Update avatar in context
        }));
  
        navigate('/profile'); // Redirect to profile instead of login
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
    finally {
      setIsOpenAvatar(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-auto">

        {
        isOpenAvatar && (
          <div className="fixed inset-0 m-3 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-auto relative"
            >
              <button
                onClick={()=>setIsOpenAvatar(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">Change Avatar</h2>
              <div className="w-[500px] grid grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-5">
                {avatars.map((avatar) => (
                  <div key={avatar.id} className="relative">
                    <img
                      src={avatar.url} // Assuming backend sends { id, url }
                      alt="Avatar"
                      className={`w-44 h-auto rounded-full cursor-pointer border-4 transition ${
                        selectedAvatar === avatar.url
                          ? 'border-blue-500'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAvatar(avatar.url)}
                    />
                    {selectedAvatar === avatar.url && (
                      <CheckCircle
                        className="absolute bottom-2 right-2 text-blue-500 bg-white rounded-full"
                        size={20}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button className="mr-8" onClick={handleSubmit}>Select</Button>
            </motion.div>
          </div>
        )
      }
    </div>
  );
}
