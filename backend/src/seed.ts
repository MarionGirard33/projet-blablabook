import { db } from './db'; // instance Drizzle
import { users, list, book, listBook } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  // 1️⃣ Supprimer les anciennes données
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

  // 4️⃣ Créer des livres avec URL d'images pour les couvertures
  const booksToInsert = [
    {
      name: 'The Great Gatsby',
      coverId:
        'https://www.stockvault.net/data/2016/10/26/214474/preview16.jpg',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel.',
      isbn: '9780743273565',
      publishingHouse: 'Scribner',
      publishedAt: '1925-04-10',
    },
    {
      name: '1984',
      coverId:
        'https://img.pikbest.com/png-images/20240923/open-old-book-on-the-wooden-table-_10876027.png!w700wp',
      author: 'George Orwell',
      description: 'Dystopian novel.',
      isbn: '9780451524935',
      publishingHouse: 'Secker & Warburg',
      publishedAt: '1949-06-08',
    },
    {
      name: 'To Kill a Mockingbird',
      coverId:
        'https://www.publicdomainpictures.net/pictures/260000/t2/vintage-stack-of-books.jpg',
      author: 'Harper Lee',
      description: 'Pulitzer Prize-winning novel.',
      isbn: '9780061120084',
      publishingHouse: 'J.B. Lippincott & Co.',
      publishedAt: '1960-07-11',
    },
    {
      name: 'Brave New World',
      coverId:
        'https://st2.depositphotos.com/50301268/46502/i/450/depositphotos_465023244-stock-photo-cup-coffee-table-spring-flowers.jpg',
      author: 'Aldous Huxley',
      description: 'Dystopian science fiction.',
      isbn: '9780060850524',
      publishingHouse: 'Chatto & Windus',
      publishedAt: '1932-08-01',
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
