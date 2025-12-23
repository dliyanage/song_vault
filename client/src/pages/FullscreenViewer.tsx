import { useRoute, Link } from "wouter";
import { useSong } from "@/hooks/use-songs";
import { X, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FullscreenViewer() {
  const [, params] = useRoute("/song/:id/view/:type");
  const id = params ? parseInt(params.id) : 0;
  const type = params?.type as "lyrics" | "chords";
  
  const { data: song, isLoading } = useSong(id);
  const [scale, setScale] = useState(1);

  if (isLoading || !song) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
    </div>
  );

  const imageUrl = type === "lyrics" ? song.lyricsImageUrl : song.chordsImageUrl;

  if (!imageUrl) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <p>No image found.</p>
      <Link href={`/song/${id}`} className="mt-4 px-4 py-2 bg-white/10 rounded-lg">Back</Link>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col h-screen overflow-hidden">
      {/* Top Bar - Minimal */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <Link href={`/song/${id}`}>
            <button className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </Link>
        </div>
        
        {song.key && (
          <div className="pointer-events-auto px-4 py-2 bg-primary/90 backdrop-blur-md rounded-full shadow-lg shadow-black/50">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Key: {song.key}</span>
          </div>
        )}
      </div>

      {/* Image Area */}
      <div className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-4">
        <motion.img 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: scale }}
          transition={{ duration: 0.3 }}
          src={imageUrl} 
          alt={`${type} view`}
          className="max-w-full max-h-full object-contain shadow-2xl"
          style={{ transformOrigin: "center center" }}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
        <button 
          onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
          className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <div className="px-4 py-3 bg-black/50 backdrop-blur-md rounded-full text-white font-mono text-sm min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </div>
        <button 
          onClick={() => setScale(s => Math.min(3, s + 0.25))}
          className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
