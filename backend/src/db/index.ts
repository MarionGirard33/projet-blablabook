import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'prod' 
    ? { rejectUnauthorized: false } // Requis pour Supabase
    : false,                        // Désactivé pour Docker local
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
