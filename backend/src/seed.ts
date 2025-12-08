import { db } from './db'; // instance Drizzle
import { users, list, book, listBook } from './db/schema';

async function main() {
  // --- Create a test user ---
  const [user] = await db
    .insert(users)
    .values({
      email: 'test@example.com',
      password: 'password123',
      username: 'TestUser',
    })
    .returning();

  console.log('Created user:', user);

  // --- Create a list for this user ---
  const [userList] = await db
    .insert(list)
    .values({
      name: 'My Reading List',
      userId: user.id,
    })
    .returning();

  console.log('Created list:', userList);

  // --- Create some books ---
  const booksToInsert = [
    {
      name: 'The Great Gatsby',
      coverId: 'https://example.com/gatsby.jpg',
      author: 'F. Scott Fitzgerald',
      description: 'A classic novel about the Jazz Age.',
      isbn: '978-3-16-148410-0',
      publishingHouse: 'Scribner',
      publishedAt: new Date('1925-04-10'),
    },
    {
      name: '1984',
      coverId: 'https://example.com/1984.jpg',
      author: 'George Orwell',
      description: 'Dystopian novel about totalitarian regime.',
      isbn: '978-0-452-28423-4',
      publishingHouse: 'Secker & Warburg',
      publishedAt: new Date('1949-06-08'),
    },
  ];

  const insertedBooks = await db.insert(book).values(booksToInsert).returning();
  console.log('Inserted books:', insertedBooks);

  // --- Add books to user list ---
  for (const b of insertedBooks) {
    await db.insert(listBook).values({
      bookId: b.id,
      listId: userList.id,
    });
  }

  console.log('Books added to user list');
}

main()
  .then(() => {
    console.log('Seeding finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
