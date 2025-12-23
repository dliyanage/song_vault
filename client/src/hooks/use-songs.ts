import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { CreateSongRequest } from "@shared/schema";

export function useSongs(search?: string) {
  return useQuery({
    queryKey: [api.songs.list.path, search],
    queryFn: async () => {
      const url = search 
        ? `${api.songs.list.path}?search=${encodeURIComponent(search)}`
        : api.songs.list.path;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch songs");
      return api.songs.list.responses[200].parse(await res.json());
    },
  });
}

export function useSong(id: number) {
  return useQuery({
    queryKey: [api.songs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.songs.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch song");
      return api.songs.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSong() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateSongRequest) => {
      const res = await fetch(api.songs.create.path, {
        method: api.songs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.songs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create song");
      }
      return api.songs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.songs.list.path] });
      toast({
        title: "Song added",
        description: "Your song has been successfully saved to the vault.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteSong() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.songs.delete.path, { id });
      const res = await fetch(url, { method: api.songs.delete.method });
      
      if (!res.ok && res.status !== 404) {
        throw new Error("Failed to delete song");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.songs.list.path] });
      toast({
        title: "Song deleted",
        description: "The song has been removed from your library.",
      });
    },
  });
}
