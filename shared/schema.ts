import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist"),
  key: text("key"),
  lyricsImageUrl: text("lyrics_image_url"),
  chordsImageUrl: text("chords_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSongSchema = createInsertSchema(songs).omit({ id: true, createdAt: true });

export type Song = typeof songs.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;

export type SongResponse = Song;
export type CreateSongRequest = InsertSong;
export type UpdateSongRequest = Partial<InsertSong>;
