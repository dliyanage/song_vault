import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateSong } from "@/hooks/use-songs";
import { PageHeader } from "@/components/PageHeader";
import { ImageUploader } from "@/components/ImageUploader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { CreateSongRequest } from "@shared/schema";

export default function AddSong() {
  const [, setLocation] = useLocation();
  const { mutate, isPending } = useCreateSong();
  
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [key, setKey] = useState("");
  const [lyricsImg, setLyricsImg] = useState<string>();
  const [chordsImg, setChordsImg] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const data: CreateSongRequest = {
      title,
      artist: artist || undefined,
      key: key || undefined,
      lyricsImageUrl: lyricsImg || null,
      chordsImageUrl: chordsImg || null,
    };

    mutate(data, {
      onSuccess: () => setLocation("/"),
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader 
          title="Add New Song" 
          subtitle="Upload lyrics and chords for your library"
          backHref="/" 
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card/50 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title" className="text-base">Song Title <span className="text-primary">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Amazing Grace"
                  className="bg-background/50 border-border h-12 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist" className="text-base">Artist</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. John Newton"
                  className="bg-background/50 border-border h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key" className="text-base">Musical Key</Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g. G Major"
                  className="bg-background/50 border-border h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <ImageUploader 
                label="Lyrics Sheet" 
                value={lyricsImg} 
                onChange={setLyricsImg} 
              />
              <ImageUploader 
                label="Chords Chart" 
                value={chordsImg} 
                onChange={setChordsImg} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/")}
              disabled={isPending}
              className="h-12 px-8 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !title}
              className="h-12 px-8 rounded-xl shadow-lg shadow-primary/25 text-base"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Song"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
