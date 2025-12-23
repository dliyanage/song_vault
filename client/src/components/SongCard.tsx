import { Link } from "wouter";
import { Music2, Mic2, FileMusic } from "lucide-react";
import { motion } from "framer-motion";
import type { SongResponse } from "@shared/schema";

interface SongCardProps {
  song: SongResponse;
  index: number;
}

export function SongCard({ song, index }: SongCardProps) {
  return (
    <Link href={`/song/${song.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="
          relative h-full
          bg-card/90 backdrop-blur-sm 
          border border-white/5 
          hover:border-primary/50
          rounded-2xl p-6
          shadow-lg shadow-black/20
          hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1
          transition-all duration-300 ease-out
        ">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Music2 className="w-6 h-6" />
            </div>
            {song.key && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary text-secondary-foreground border border-white/5">
                Key: {song.key}
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {song.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-6 line-clamp-1">
            {song.artist || "Unknown Artist"}
          </p>
          
          <div className="flex gap-2 mt-auto">
            {song.lyricsImageUrl && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                <Mic2 className="w-3 h-3" /> Lyrics
              </div>
            )}
            {song.chordsImageUrl && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                <FileMusic className="w-3 h-3" /> Chords
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
