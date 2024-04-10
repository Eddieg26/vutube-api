import {pgTable, text, uuid} from 'drizzle-orm/pg-core';

export const videosTable = pgTable('videos', {
  id: uuid('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  url: text('url').notNull().unique(),
  userId: uuid('user_id').notNull(),
});

export type Video = typeof videosTable._.inferSelect;