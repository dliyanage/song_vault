import { db } from "./db";
import {
  songs,
  type Song,
  type InsertSong,
  type UpdateSongRequest
} from "@shared/schema";
import { eq, ilike } from "drizzle-orm";

export interface IStorage {
  getSongs(search?: string): Promise<Song[]>;
  getSong(id: number): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  updateSong(id: number, updates: UpdateSongRequest): Promise<Song>;
  deleteSong(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSongs(search?: string): Promise<Song[]> {
    if (search) {
      return await db.select().from(songs).where(ilike(songs.title, `%${search}%`));
    }
    return await db.select().from(songs);
  }

  async getSong(id: number): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const [song] = await db.insert(songs).values(insertSong).returning();
    return song;
  }

  async updateSong(id: number, updates: UpdateSongRequest): Promise<Song> {
    const [song] = await db.update(songs).set(updates).where(eq(songs.id, id)).returning();
    return song;
  }

  async deleteSong(id: number): Promise<void> {
    await db.delete(songs).where(eq(songs.id, id));
  }
}

export const storage = new DatabaseStorage();
