import { db } from './db';
import { book, bookCategory, category } from './db/schema';
import { booksData } from './seed-books-data';

async function seed() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('Seeding : 100 livres avec des ISBN valides OpenLibrary...');

  const categoriesToInsert = [
    { name: 'random' },
    { name: 'bestsellers' },
    { name: 'horror' },
    { name: 'love' },
    { name: 'fantasy' },
  ];

  // Standardisation stricte
  const standardizedBooks = booksData.map((b) => ({
    name: b.name,
    author: b.author,
    description: b.description,
    isbn: b.isbn,
    publishedAt: b.publishedAt,
    coverId: b.coverId,
    publishingHouse: b.publishingHouse,
  }));

  // Insertion Livres
  await db
    .insert(book)
    .values(standardizedBooks)
    .onConflictDoNothing({ target: book.isbn })
    .returning();

  // Insertion Catégories
  await db
    .insert(category)
    .values(categoriesToInsert)
    .onConflictDoNothing({ target: category.name });

  const allCategories = await db.select().from(category);
  const allBooks = await db.select().from(book);

  // Liaisons pour TOUS les livres (même les existants)
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

  console.log('Seeding terminé ! 🚀');
}

seed().catch((error) => {
  console.error('Erreur :', error);
  process.exit(1);
});
