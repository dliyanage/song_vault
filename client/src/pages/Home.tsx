import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Music4 } from "lucide-react";
import { useSongs } from "@/hooks/use-songs";
import { SongCard } from "@/components/SongCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: songs, isLoading } = useSongs(search);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/25">
              <Music4 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">SongVault</h1>
              <p className="text-muted-foreground">Your digital song library</p>
            </div>
          </div>
          
          <Link href="/add">
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Add Song
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            className="pl-12 py-6 text-lg rounded-2xl bg-card border-border/50 focus:ring-primary/20 shadow-lg shadow-black/5"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted/10 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : songs?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-6">
              <Music4 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No songs found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {search ? "Try adjusting your search terms." : "Get started by adding your first song to the library."}
            </p>
            {!search && (
              <Link href="/add">
                <Button variant="outline" size="lg" className="rounded-xl">
                  Create First Song
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs?.map((song, idx) => (
              <SongCard key={song.id} song={song} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
