"use client";

import axiosInstance from "@/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const deletePlaylist = async (id) => {
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
  };

  const updatePlaylist = async () => {
    try {
      const res = await axiosInstance.put(`/playlist/updateplaylist/${editingPlaylist._id}`, {
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

  return (
    <div className="flex flex-col gap-6 mt-10 px-4 md:px-8">
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
        <Card key={playlist._id} className="w-full max-w-4xl mx-auto shadow-lg border border-muted-foreground/20 bg-gradient-to-r from-background to-muted/50 rounded-xl group">
          <CardContent className="flex items-center gap-6 p-5 relative">
            <Link to={`/playlists/${playlist._id}`} className="flex gap-6 w-full">
              <div className="rounded-lg w-[140px] h-[90px] overflow-hidden shadow-md">
                <img src="/playlist.jpeg" alt={playlist?.name || "Playlist"} className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground group-hover:hidden">{playlist.name}</h2>
                <p className="text-sm text-muted-foreground group-hover:hidden">{playlist.description}</p>
                <p className="text-xs text-muted-foreground group-hover:hidden">Videos: {playlist.videos.length}</p>
                <p className="text-sm text-muted-foreground group-hover:hidden">
                  {new Date(playlist.createdAt).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

              </div>
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-[95%] transition-opacity duration-300 p-5 flex flex-col justify-center rounded-xl text-center text-white">
              <p className="text-lg font-semibold italic">{playlist.name}</p>
              <p className="text-md italic">{playlist.description}</p>
            </div>
            </Link>
            
            <div className="absolute top-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="outline" size="icon" onClick={() => { setEditingPlaylist(playlist); setIsDialogOpen(true); }}>
                <Edit className="w-5 h-5 text-primary" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => deletePlaylist(playlist._id)}>
                <Trash className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Playlist</DialogTitle>
          </DialogHeader>
          <Input placeholder="Name" value={editingPlaylist?.name || ''} onChange={(e) => setEditingPlaylist({ ...editingPlaylist, name: e.target.value })} />
          <Textarea placeholder="Description" value={editingPlaylist?.description || ''} onChange={(e) => setEditingPlaylist({ ...editingPlaylist, description: e.target.value })} />
          <Select value={editingPlaylist?.category || ''} onValueChange={(value) => setEditingPlaylist({ ...editingPlaylist, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="series">Series</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={updatePlaylist}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Playlists;