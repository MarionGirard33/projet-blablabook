import { db } from './db';
import { user, list, book, listBook } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  // 1️⃣ Delete old data
  await db.delete(listBook).execute();
  await db.delete(book).execute();
  await db.delete(list).execute();
  await db.delete(user).execute();

  // 2️⃣ Create test user
  const [userTable] = await db
    .insert(user)
    .values({
      email: 'test@example.com',
      password: 'password123',
      username: 'TestUser',
      role: 'USER',
    })
    .returning();

  if (!userTable) throw new Error("User insert failed");

  // 3️⃣ Create the user list
  const [userList] = await db
    .insert(list)
    .values({
      name: 'My Reading List',
      userId: userTable.id,
    })
    .returning();

  if (!userList) throw new Error("User list insert failed");

  // 4️⃣ Create books
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

  if (!insertedBooks || insertedBooks.length !== booksToInsert.length) 
  throw new Error("Books insert failed");

  // 5️⃣ Add each book with different reading status
  await db
    .insert(listBook)
    .values([
      {
        listId: userList.id,
        bookId: insertedBooks[0].id,
        readStart: null,
        readEnd: null, // → À lire
      },
      {
        listId: userList.id,
        bookId: insertedBooks[1].id,
        readStart: new Date('2025-01-01'),
        readEnd: null, // → En cours
      },
      {
        listId: userList.id,
        bookId: insertedBooks[2].id,
        readStart: new Date('2024-10-01'),
        readEnd: new Date('2024-11-01'), // → Lu
      },
      {
        listId: userList.id,
        bookId: insertedBooks[3].id,
        readStart: null,
        readEnd: null, // → À lire
      },
    ])
    .execute();

  console.log('Database seeded successfully!');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
