import axiosInstance from '@/axiosInstance'
import React, { useState } from 'react'

const Playlists = () => {
    // const [playlists, setPlaylists] = useState([])
    // const [error, setError] = useState(false)
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     const fetchPlaylists = async () => {
    //         try {
    //             const response = await axiosInstance.get('/playlist/getplaylists')
    //             if (response.data.success) {
    //                 setPlaylists(response.data.data)
    //             } else {
    //                 setError('Failed to fetch playlists')
    //             }
    //         } catch (error) {
    //             setError('Failed to fetch playlists')
    //         }
    //         setLoading(false)
    //     }

    //     fetchPlaylists()
    // })


  return (
    <div className='bg-muted mt-16 w-[95%] sm:w-[85%] lg:w-[60%] mx-auto min-h-[100vh] rounded'>
        {/* <h1 className='text-2xl font-bold text-center mt-8'>Playlists</h1>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {playlists.map((playlist) => (
            <div key={playlist._id} className='bg-white p-4 mt-4 rounded'>
            <h2 className='text-xl font-semibold'>{playlist.name}</h2>
            <p>{playlist.description}</p>
            </div>
        ))} */}
    </div>
  )
}

export default Playlists
