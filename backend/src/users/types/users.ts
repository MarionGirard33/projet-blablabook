import { users } from 'src/db/schema';

export type UserSelect = typeof users.$inferSelect; // drizzle generated type for user with schema
export type UserInsert = typeof users.$inferInsert;
