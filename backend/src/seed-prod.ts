import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Charger .env manuellement si présent (évite d'ajouter dotenv comme dépendance)
try {
  const candidates = [
    join(process.cwd(), '.env'),
    join(process.cwd(), '..', '.env'),
    join(__dirname, '..', '..', '.env'),
  ];
  let content: string | null = null;
  for (const p of candidates) {
    try {
      content = readFileSync(p, 'utf8');
      console.log('Loaded .env from', p);
      break;
    } catch (e) {
      // ignore
    }
  }
  if (content) {
    content.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (!match) return;
      const key = match[1].trim();
      let val = match[2].trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    });
  }
} catch (e) {
  // ignore if .env absent
}

// Forcer NODE_ENV prod puis utiliser SUPABASE_URL si présent (override)
process.env.NODE_ENV = 'prod';
if (process.env.SUPABASE_URL) {
  process.env.DATABASE_URL = process.env.SUPABASE_URL;
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Seeding (prod) : 100 livres avec des ISBN valides OpenLibrary...');

import { db } from './db';
import { book, bookCategory, category } from './db/schema';
import { booksData } from './seed-books-data';

async function seed() {
  const categoriesToInsert = [
    { name: 'random' },
    { name: 'bestsellers' },
    { name: 'horror' },
    { name: 'love' },
    { name: 'fantasy' },
  ];

  const standardizedBooks = booksData.map((b) => ({
    name: b.name,
    author: b.author,
    description: b.description,
    isbn: b.isbn,
    publishedAt: b.publishedAt,
    coverId: b.coverId,
    publishingHouse: b.publishingHouse,
  }));

  await db
    .insert(book)
    .values(standardizedBooks)
    .onConflictDoNothing({ target: book.isbn })
    .returning();

  await db
    .insert(category)
    .values(categoriesToInsert)
    .onConflictDoNothing({ target: category.name });

  const allCategories = await db.select().from(category);
  const allBooks = await db.select().from(book);

  const links = booksData
    .map((b, i) => {
      let catName = 'random';
      if (i >= 20 && i < 40) catName = 'bestsellers';
      if (i >= 40 && i < 60) catName = 'horror';
      if (i >= 60 && i < 80) catName = 'love';
      if (i >= 80) catName = 'fantasy';

      const bookInDb = allBooks.find((book) => book.isbn === b.isbn);
      if (!bookInDb) return null;

      const category_ = allCategories.find((c) => c.name === catName);
      if (!category_) return null;

      return {
        bookId: bookInDb.id,
        categoryId: category_.id,
      };
    })
    .filter((link) => link !== null);

  if (links.length > 0) {
    await db.insert(bookCategory).values(links).onConflictDoNothing();
    console.log(`${links.length} liaisons créées avec succès ! 🔗`);
  }

  console.log('Seeding (prod) terminé ! 🚀');
}

seed().catch((error) => {
  console.error('Erreur :', error);
  process.exit(1);
});
