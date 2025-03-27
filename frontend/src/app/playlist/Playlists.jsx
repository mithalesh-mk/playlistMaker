"use client";

import axiosInstance from "@/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, Edit, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FaThumbsUp, FaThumbsDown, FaLink, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { motion } from "framer-motion";



const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [playlistNameChecker, setPlaylistNameChecker] = useState('');
  
  const deletePlaylist = async (id) => {
    if(playlistNameChecker !== playlists.find(p => p._id === id).name) {
      setPlaylistNameChecker('');
      return toast({ description: "Wrong Playlist Name", variant: "destructive" });
    }
    setIsOpenDelete(false);
    try {
      const res = await axiosInstance.delete(`/playlist/deleteplaylist/${id}`);
      if (!res.data.success) {
        return toast({ description: res.data.message, variant: "destructive" });
      }
      setPlaylists(playlists.filter((playlist) => playlist._id !== id));
      toast({ description: "Playlist deleted successfully" });
    } catch (error) {
      toast({ description: "Failed to delete playlist", variant: "destructive" });
    }
    finally { 
      setPlaylistNameChecker('');
    }
  };

  const updatePlaylist = async () => {
    try {
      const res = await axiosInstance.put(`/playlist/updatePlaylist/${editingPlaylist._id}`, {
        name: editingPlaylist.name,
        description: editingPlaylist.description,
        category: editingPlaylist.category,
      });
      if (!res.data.success) {
        return toast({ description: res.data.message, variant: "destructive" });
      }
      setPlaylists(playlists.map(p => p._id === editingPlaylist._id ? editingPlaylist : p));
      toast({ description: "Playlist updated successfully" });
      setIsDialogOpen(false);
    } catch (error) {
      toast({ description: "Failed to update playlist", variant: "destructive" });
    }
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/playlist/userplaylists");
        if (response.data.success) {
          setPlaylists(response.data.data);
        } else {
          setError("Failed to fetch playlists");
        }
      } catch (error) {
        setError("Failed to fetch playlists");
      }
      setLoading(false);
    };
    fetchPlaylists();
  }, []);
  console.log(playlists);

  return (
    <div className="flex flex-row gap-6 mt-10 px-4 md:px-8">
      {loading && (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl bg-muted" />
          ))}
        </div>
      )}
      {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
      {!loading && playlists.length === 0 && (
        <div className="text-center text-muted-foreground text-lg">No playlists found</div>
      )}
      
      {playlists.map((playlist) => (
        <div
              className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-5 rounded-2xl shadow-2xl w-full sm:w-80 transition-all duration-300 border border-gray-700"
            >
                <div className="flex justify-end items-end gap-5 mb-4">
                    <button className="text-gray-400 hover:text-green-700 transition-all"
                    onClick={() => { setEditingPlaylist(playlist); setIsDialogOpen(true); }}
                    >
                        <Edit size={20} />
                    </button>
                    <button className="text-gray-400 hover:text-red-700 transition-all"
                      onClick={() => { 
                        setIsOpenDelete(true); }}
                    >
                        <Trash size={20} />
                    </button>
                </div>
              <Link to={`/playlists/${playlist._id}`} key={playlist._id}>
              <div className="relative w-full h-44 rounded-xl overflow-hidden">
                <img
                  src="/playlist.jpeg"
                  alt="Card"
                  className="w-full h-full object-cover transform hover:scale-110 transition-all duration-300"
                />
              </div>
              <h3 className="text-xl font-extrabold mt-4 text-white">{playlist.name}</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                {playlist.description}
              </p>
              <p className="text-sm text-white text-muted-foreground group-hover:hidden">
                {new Date(playlist.createdAt).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1 hover:text-gray-200 cursor-pointer transition-all"><FaThumbsUp /> 1</span>
                  <span className="flex items-center gap-1 hover:text-gray-200 cursor-pointer transition-all"><FaThumbsDown /> 1</span>
                  <span className="flex items-center gap-1 hover:text-gray-200 cursor-pointer transition-all"><FaLink /> 0</span>
                  <span className="flex border px-1 rounded-md border-white items-center gap-1 hover:text-gray-200 cursor-pointer transition-all">{playlist.category}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400">
                  <FaStar /> <span className="text-white">4.5</span>
                </div>
              </div>
            </Link>
            

            {isOpenDelete && (
              <div className="fixed inset-0 m-3 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full relative"
                >
                  <button
                    onClick={() => setIsOpenDelete(!isOpenDelete)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-200">
                    Are you sure you want to delete your playlist?
                  </h2>
                    <div>
                      <label className="block text-gray-600 dark:text-gray-300">
                        Enter your UserName i.e "{playlist.name}" to confirm:
                      </label>
                      <input
                        type="text"
                        value={playlistNameChecker}
                        onChange={(e) => setPlaylistNameChecker(e.target.value)}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400"
                        placeholder="your username"
                      />
                    </div>

                    <div className="flex justify-center mt-4">
                      
                      <button
                        onClick={() => {
                          deletePlaylist(playlist._id);
                          setIsOpenDelete(false);
                        }}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                      >
                        Confirm Delete
                      </button>
                    </div>
                </motion.div>
              </div>
            )}

            {
              isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg w-96 text-white"
                  >
                    <h2 className="text-xl font-bold mb-4">Edit Playlist</h2>
                    <label className="block text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-white"
                      value={editingPlaylist?.name || ''} onChange={(e) => setEditingPlaylist({ ...editingPlaylist, name: e.target.value })}
                    />
                    <label className="block text-gray-400 mb-2">Description</label>
                    <textarea
                      rows="4"
                      placeholder="Description"
                      className="w-full h-auto p-2 border border-gray-600 rounded mb-2 bg-gray-800 text-white"
                      value={editingPlaylist?.description || ''} onChange={(e) => setEditingPlaylist({ ...editingPlaylist, description: e.target.value })}
                    />
                    <label className="block text-gray-400 mb-2">Category</label>
                    <select
                      className="cursor-pointer w-full p-2 border border-gray-600 rounded mb-4 bg-gray-800 text-white"
                      value={editingPlaylist?.category || ''} onChange={(e) => setEditingPlaylist({ ...editingPlaylist, category: e.target.value })}
                    >
                      <option value="" disabled>Select category</option>
                      <option value="education">Education</option>
                      <option value="series">Series</option>
                      <option value="sports">Sports</option>
                      <option value="music">Music</option>
                      <option value="travel">Travel</option>
                      <option value="others">Others</option>
                    </select>
                    <div className="flex justify-end space-x-2">
                      <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500" onClick={() => setIsDialogOpen(false)}>Cancel</button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500" onClick={updatePlaylist}>Save</button>
                    </div>
                  </motion.div>
                </div>
              )
            }

        </div>
      ))}
    </div>
  );
};

export default Playlists;