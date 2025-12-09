import { db } from './db'; // instance Drizzle
import { users, list, book, listBook } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  // 1️⃣ Supprimer les anciennes données (si besoin)
  await db.delete(listBook).execute();
  await db.delete(book).execute();
  await db.delete(list).execute();
  await db.delete(users).execute();

  // 2️⃣ Créer un utilisateur test
  const [user] = await db
    .insert(users)
    .values({
      email: 'test@example.com',
      password: 'password123',
      username: 'TestUser',
      role: 'USER',
    })
    .returning();

  // 3️⃣ Créer une liste pour cet utilisateur
  const [userList] = await db
    .insert(list)
    .values({
      name: 'My Reading List',
      userId: user.id,
    })
    .returning();

  // 4️⃣ Créer des livres
  const booksToInsert = [
    {
      name: 'The Great Gatsby',
      coverId: 'cover1.jpg',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel.',
      isbn: '9780743273565',
      publishingHouse: 'Scribner',
      publishedAt: '1925-04-10', // ⚡ mettre en string YYYY-MM-DD
    },
    {
      name: '1984',
      coverId: 'cover2.jpg',
      author: 'George Orwell',
      description: 'Dystopian novel.',
      isbn: '9780451524935',
      publishingHouse: 'Secker & Warburg',
      publishedAt: '1949-06-08', // ⚡ string
    },
  ];

  const insertedBooks = await db.insert(book).values(booksToInsert).returning();

  // 5️⃣ Ajouter les livres à la liste de l'utilisateur
  for (const b of insertedBooks) {
    await db
      .insert(listBook)
      .values({
        listId: userList.id,
        bookId: b.id,
      })
      .execute();
  }

  console.log('Database seeded successfully!');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
