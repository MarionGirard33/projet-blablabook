import { db } from './db';
import { users, list, book, listBook } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  // 1️⃣ Delete old data
  await db.delete(listBook).execute();
  await db.delete(book).execute();
  await db.delete(list).execute();
  await db.delete(users).execute();

  // 2️⃣ Create test user
  const [user] = await db
    .insert(users)
    .values({
      email: 'test@example.com',
      password: 'password123',
      username: 'TestUser',
      role: 'USER',
    })
    .returning();

  // 3️⃣ Create the user list
  const [userList] = await db
    .insert(list)
    .values({
      name: 'My Reading List',
      userId: user.id,
    })
    .returning();

  // 4️⃣ Books from OpenLibrary (REAL ISBN)
  const booksToInsert = [
    {
      name: 'Moby-Dick',
      coverId: 'https://covers.openlibrary.org/b/id/8100921-L.jpg',
      author: 'Herman Melville',
      description: 'Epic tale of obsession and the sea.',
      isbn: '9780142437247',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1851-10-18',
    },
    {
      name: 'Crime and Punishment',
      coverId: 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
      author: 'Fyodor Dostoevsky',
      description: 'A psychological exploration of guilt and redemption.',
      isbn: '9780140449136',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1866-01-01',
    },
    {
      name: 'The Catcher in the Rye',
      coverId: 'https://covers.openlibrary.org/b/id/8225266-L.jpg',
      author: 'J.D. Salinger',
      description: "A rebellious teenager's journey in New York.",
      isbn: '9780316769488',
      publishingHouse: 'Little, Brown and Company',
      publishedAt: '1951-07-16',
    },
    {
      name: 'The Hobbit',
      coverId: 'https://covers.openlibrary.org/b/id/8108691-L.jpg',
      author: 'J.R.R. Tolkien',
      description: 'A fantasy adventure that precedes the Lord of the Rings.',
      isbn: '9780547928227',
      publishingHouse: 'HarperCollins',
      publishedAt: '1937-09-21',
    },
    {
      name: 'The Fellowship of the Ring',
      coverId: 'https://covers.openlibrary.org/b/id/8101356-L.jpg',
      author: 'J.R.R. Tolkien',
      description: 'The first part of the Lord of the Rings trilogy.',
      isbn: '9780547928210',
      publishingHouse: 'HarperCollins',
      publishedAt: '1954-07-29',
    },
    {
      name: 'The Two Towers',
      coverId: 'https://covers.openlibrary.org/b/id/8235119-L.jpg',
      author: 'J.R.R. Tolkien',
      description: 'The second part of the Lord of the Rings trilogy.',
      isbn: '9780547928203',
      publishingHouse: 'HarperCollins',
      publishedAt: '1954-11-11',
    },
    {
      name: 'The Return of the King',
      coverId: 'https://covers.openlibrary.org/b/id/8235120-L.jpg',
      author: 'J.R.R. Tolkien',
      description: 'The final part of the Lord of the Rings trilogy.',
      isbn: '9780547928197',
      publishingHouse: 'HarperCollins',
      publishedAt: '1955-10-20',
    },
    {
      name: 'Frankenstein',
      coverId: 'https://covers.openlibrary.org/b/id/8341061-L.jpg',
      author: 'Mary Shelley',
      description: 'A gothic novel about creation and monstrosity.',
      isbn: '9780141439471',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1818-01-01',
    },
    {
      name: 'The Picture of Dorian Gray',
      coverId: 'https://covers.openlibrary.org/b/id/8231990-L.jpg',
      author: 'Oscar Wilde',
      description: 'A dark tale of vanity, beauty and corruption.',
      isbn: '9780141439570',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1890-07-01',
    },
    {
      name: 'Wuthering Heights',
      coverId: 'https://covers.openlibrary.org/b/id/8231852-L.jpg',
      author: 'Emily Brontë',
      description: 'A stormy tale of passion on the Yorkshire moors.',
      isbn: '9780141439556',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1847-12-01',
    },
    {
      name: 'Jane Eyre',
      coverId: 'https://covers.openlibrary.org/b/id/8231993-L.jpg',
      author: 'Charlotte Brontë',
      description: 'A young woman’s journey toward independence.',
      isbn: '9780141441146',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1847-10-16',
    },
    {
      name: 'Dracula',
      coverId: 'https://covers.openlibrary.org/b/id/8231858-L.jpg',
      author: 'Bram Stoker',
      description: 'The original vampire classic.',
      isbn: '9780141439846',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1897-05-26',
    },
    {
      name: 'The Odyssey',
      coverId: 'https://covers.openlibrary.org/b/id/8235061-L.jpg',
      author: 'Homer',
      description: 'The Greek epic following Odysseus’ long voyage home.',
      isbn: '9780140268867',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1800-01-01',
    },
    {
      name: 'The Iliad',
      coverId: 'https://covers.openlibrary.org/b/id/8235059-L.jpg',
      author: 'Homer',
      description: 'Epic poem recounting the Trojan War.',
      isbn: '9780140275360',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1762-01-01',
    },
    {
      name: 'Anna Karenina',
      coverId: 'https://covers.openlibrary.org/b/id/8339256-L.jpg',
      author: 'Leo Tolstoy',
      description: 'A tragic tale of love and society in Imperial Russia.',
      isbn: '9780143035008',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1877-01-01',
    },
  ];

  const insertedBooks = await db.insert(book).values(booksToInsert).returning();

  // 5️⃣ Add each book to the user’s list
  await db
    .insert(listBook)
    .values([
      // À lire
      ...insertedBooks.slice(0, 5).map((b) => ({
        listId: userList.id,
        bookId: b.id,
        readStart: null,
        readEnd: null,
      })),

      // En cours
      ...insertedBooks.slice(5, 10).map((b) => ({
        listId: userList.id,
        bookId: b.id,
        readStart: new Date('2025-01-01'),
        readEnd: null,
      })),

      // Lus
      ...insertedBooks.slice(10, 15).map((b) => ({
        listId: userList.id,
        bookId: b.id,
        readStart: new Date('2024-10-01'),
        readEnd: new Date('2024-11-01'),
      })),
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
