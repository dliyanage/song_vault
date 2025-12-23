import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // List songs (with optional search)
  app.get(api.songs.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const songs = await storage.getSongs(search);
    res.json(songs);
  });

  // Get single song
  app.get(api.songs.get.path, async (req, res) => {
    const song = await storage.getSong(Number(req.params.id));
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  });

  // Create song
  app.post(api.songs.create.path, async (req, res) => {
    try {
      const input = api.songs.create.input.parse(req.body);
      const song = await storage.createSong(input);
      res.status(201).json(song);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Delete song
  app.delete(api.songs.delete.path, async (req, res) => {
    const song = await storage.getSong(Number(req.params.id));
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    await storage.deleteSong(Number(req.params.id));
    res.status(204).send();
  });

  // Seeding function (called once internally)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getSongs();
  if (existing.length === 0) {
    console.log("Seeding database...");
    await storage.createSong({
      title: "Amazing Grace",
      artist: "John Newton",
      key: "G",
      // Placeholder base64 or empty - keeping empty for now or use a placeholder URL if I had one.
      // Since it's text, I can't easily put a real image here without bloating the file.
      // I'll leave images undefined for the seed.
    });
    await storage.createSong({
      title: "10,000 Reasons",
      artist: "Matt Redman",
      key: "F",
    });
    console.log("Database seeded.");
  }
}
