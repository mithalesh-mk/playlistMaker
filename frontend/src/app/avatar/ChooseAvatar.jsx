import { useState, useEffect, use } from 'react';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/userContext/AuthProvider';

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

export default function ChooseAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth()  

 
  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/select-avatar', { avatar:selectedAvatar,id: user._id });
      console.log('Avatar selected successfully!');
      const data = res.data;
      if(data.success){
        console.log(data)
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  }
  console.log(selectedAvatar)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        
        <div className="flex flex-col items-center gap-6 p-6">
          <h2 className="text-2xl font-semibold">Choose Your Avatar</h2>

          {/* Avatar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-5">
            {avatars.map((avatar) => (
              <div key={avatar.id} className="relative">
                <img
                  src={avatar.url} // Assuming backend sends { id, url }
                  alt="Avatar"
                  className={`w-24 h-24 rounded-full cursor-pointer border-4 transition ${
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

          {/* Display Selected Avatar */}
          {selectedAvatar && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Selected Avatar:</h3>
              <img
                src={selectedAvatar}
                alt="Selected Avatar"
                className="w-24 h-24 rounded-full mt-2 border-4 border-blue-500"
              />
            </div>
          )}

        <Button className="mr-8" onClick={handleSubmit}>Select</Button>
        </div>
      </div>
    </div>
  );
}
