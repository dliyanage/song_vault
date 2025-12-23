import { useRoute, Link, useLocation } from "wouter";
import { useSong, useDeleteSong } from "@/hooks/use-songs";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Mic2, FileMusic, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SongDetails() {
  const [, params] = useRoute("/song/:id");
  const [, setLocation] = useLocation();
  const id = params ? parseInt(params.id) : 0;
  
  const { data: song, isLoading, error } = useSong(id);
  const { mutate: deleteSong, isPending: isDeleting } = useDeleteSong();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (error || !song) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h2 className="text-2xl font-bold mb-2">Song Not Found</h2>
      <Link href="/">
        <Button variant="outline">Return Home</Button>
      </Link>
    </div>
  );

  const handleDelete = () => {
    deleteSong(id, {
      onSuccess: () => setLocation("/"),
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader 
          title={song.title} 
          subtitle={song.artist || "Unknown Artist"}
          backHref="/"
          action={
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Song?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete "{song.title}" from your library.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Key Display */}
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50 border border-white/5">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Key</span>
              <span className="text-xl font-bold text-foreground">{song.key || "—"}</span>
            </div>
          </div>

          {/* Action Tiles */}
          {song.lyricsImageUrl ? (
            <Link href={`/song/${id}/view/lyrics`}>
              <div className="
                group relative aspect-[4/3] cursor-pointer
                rounded-3xl overflow-hidden
                bg-card border border-white/5
                hover:border-primary/50
                transition-all duration-300
                shadow-lg hover:shadow-2xl hover:-translate-y-1
              ">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                  src={song.lyricsImageUrl} 
                  alt="Lyrics Preview" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Mic2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary-foreground transition-colors">Lyrics</h3>
                  <p className="text-white/60 mt-1">View fullscreen lyrics sheet</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="
              aspect-[4/3] rounded-3xl
              bg-muted/10 border-2 border-dashed border-muted
              flex flex-col items-center justify-center
              text-muted-foreground
            ">
              <Mic2 className="w-12 h-12 mb-4 opacity-20" />
              <p>No Lyrics Available</p>
            </div>
          )}

          {song.chordsImageUrl ? (
            <Link href={`/song/${id}/view/chords`}>
              <div className="
                group relative aspect-[4/3] cursor-pointer
                rounded-3xl overflow-hidden
                bg-card border border-white/5
                hover:border-primary/50
                transition-all duration-300
                shadow-lg hover:shadow-2xl hover:-translate-y-1
              ">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img 
                  src={song.chordsImageUrl} 
                  alt="Chords Preview" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <FileMusic className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary-foreground transition-colors">Chords</h3>
                  <p className="text-white/60 mt-1">View fullscreen chords chart</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="
              aspect-[4/3] rounded-3xl
              bg-muted/10 border-2 border-dashed border-muted
              flex flex-col items-center justify-center
              text-muted-foreground
            ">
              <FileMusic className="w-12 h-12 mb-4 opacity-20" />
              <p>No Chords Available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
