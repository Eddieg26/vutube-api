import { date, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const accountsTable = pgTable('accounts', {
  id: uuid('id').primaryKey().default('gen_random_uuid()'),
  user_id: uuid('user_id').notNull(),
  username: text('username').unique().notNull(),
  created_at: date('created_at').notNull().default('now()'),
  updated_at: date('updated_at').notNull().default('now()'),
});

export type Account = typeof accountsTable._.inferSelect;
