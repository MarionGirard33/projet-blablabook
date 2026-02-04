import { db } from './db';
import { book, bookCategory, category } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  const categoriesToInsert = [
    { name: 'random' },
    { name: 'horror' },
    { name: 'love' },
  ];

  const booksToInsert = [
    // ================= RANDOM =================
    {
      name: 'Moby-Dick',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg',
      author: 'Herman Melville',
      description: 'Epic tale of obsession and the sea.',
      isbn: '9780142437247',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1851-10-18',
    },
    {
      name: 'Crime and Punishment',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg',
      author: 'Fyodor Dostoevsky',
      description: 'A psychological exploration of guilt and redemption.',
      isbn: '9780140449136',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1866-01-01',
    },
    {
      name: 'The Hobbit',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
      author: 'J.R.R. Tolkien',
      description: 'A fantasy adventure that precedes the Lord of the Rings.',
      isbn: '9780547928227',
      publishingHouse: 'HarperCollins',
      publishedAt: '1937-09-21',
    },
    {
      name: 'Wuthering Heights',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg',
      author: 'Emily Brontë',
      description: 'A stormy tale of passion.',
      isbn: '9780141439556',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1847-12-01',
    },
    {
      name: 'Anna Karenina',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780143035008-L.jpg',
      author: 'Leo Tolstoy',
      description: 'Love and tragedy in Imperial Russia.',
      isbn: '9780143035008',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1877-01-01',
    },
    {
      name: 'The Picture of Dorian Gray',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg',
      author: 'Oscar Wilde',
      description: 'Vanity, beauty, and corruption.',
      isbn: '9780141439570',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1890-07-01',
    },
    {
      name: '1984',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
      author: 'George Orwell',
      description: 'A dystopian surveillance state.',
      isbn: '9780451524935',
      publishingHouse: 'Signet Classics',
      publishedAt: '1949-06-08',
    },
    {
      name: 'Brave New World',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
      author: 'Aldous Huxley',
      description: 'A futuristic dystopia.',
      isbn: '9780060850524',
      publishingHouse: 'Harper Perennial',
      publishedAt: '1932-01-01',
    },
    {
      name: 'The Old Man and the Sea',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780684801223-L.jpg',
      author: 'Ernest Hemingway',
      description: 'A fisherman’s final battle.',
      isbn: '9780684801223',
      publishingHouse: 'Scribner',
      publishedAt: '1952-09-01',
    },
    {
      name: 'The Stranger',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780679720201-L.jpg',
      author: 'Albert Camus',
      description: 'Existential alienation.',
      isbn: '9780679720201',
      publishingHouse: 'Vintage',
      publishedAt: '1942-01-01',
    },
    {
      name: 'Frankenstein',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg',
      author: 'Mary Shelley',
      description: 'A man creates a monster.',
      isbn: '9780141439471',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1818-01-01',
    },
    {
      name: 'Don Quixote',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg',
      author: 'Miguel de Cervantes',
      description: 'A knight chasing illusions.',
      isbn: '9780060934347',
      publishingHouse: 'Harper Perennial',
      publishedAt: '1605-01-01',
    },
    // ================= LOVE =================
    {
      name: 'Pride and Prejudice',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
      author: 'Jane Austen',
      description: 'A timeless romance of manners.',
      isbn: '9780141439518',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1813-01-28',
    },
    {
      name: 'The Notebook',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780446676090-L.jpg',
      author: 'Nicholas Sparks',
      description: 'A love that transcends time.',
      isbn: '9780446676090',
      publishingHouse: 'Grand Central Publishing',
      publishedAt: '1996-10-01',
    },
    {
      name: 'Me Before You',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780143124542-L.jpg',
      author: 'Jojo Moyes',
      description: 'Love and difficult choices.',
      isbn: '9780143124542',
      publishingHouse: 'Penguin Books',
      publishedAt: '2012-01-05',
    },
    {
      name: 'Outlander',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780440212560-L.jpg',
      author: 'Diana Gabaldon',
      description: 'Time travel romance.',
      isbn: '9780440212560',
      publishingHouse: 'Dell',
      publishedAt: '1991-06-01',
    },
    {
      name: "The Time Traveler's Wife",
      coverId: 'https://covers.openlibrary.org/b/isbn/9780156029438-L.jpg',
      author: 'Audrey Niffenegger',
      description: 'A love story across time.',
      isbn: '9780156029438',
      publishingHouse: 'Harcourt',
      publishedAt: '2003-09-01',
    },
    {
      name: 'Jane Eyre',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg',
      author: 'Charlotte Brontë',
      description: 'Gothic romance and independence.',
      isbn: '9780141441146',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1847-10-16',
    },
    {
      name: 'Emma',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780141439587-L.jpg',
      author: 'Jane Austen',
      description: 'Matchmaking and misunderstandings.',
      isbn: '9780141439587',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1815-12-23',
    },
    {
      name: 'Romeo and Juliet',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780743477116-L.jpg',
      author: 'William Shakespeare',
      description: 'Tragic young love.',
      isbn: '9780743477116',
      publishingHouse: 'Simon & Schuster',
      publishedAt: '1597-01-01',
    },
    {
      name: 'The Rosie Project',
      coverId: 'https://covers.openlibrary.org/b/isbn/9781476729084-L.jpg',
      author: 'Graeme Simsion',
      description: 'A quirky love story.',
      isbn: '9781476729084',
      publishingHouse: 'Simon & Schuster',
      publishedAt: '2013-01-01',
    },
    {
      name: 'Eleanor & Park',
      coverId: 'https://covers.openlibrary.org/b/isbn/9781250012579-L.jpg',
      author: 'Rainbow Rowell',
      description: 'First love in the 80s.',
      isbn: '9781250012579',
      publishingHouse: "St. Martin's Griffin",
      publishedAt: '2013-02-26',
    },
    {
      name: 'Call Me by Your Name',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780312426781-L.jpg',
      author: 'André Aciman',
      description: 'A summer romance in Italy.',
      isbn: '9780312426781',
      publishingHouse: 'Picador',
      publishedAt: '2007-01-23',
    },
    {
      name: 'One Day',
      coverId: 'https://covers.openlibrary.org/b/isbn/9780307946713-L.jpg',
      author: 'David Nicholls',
      description: 'Twenty years, one day a year.',
      isbn: '9780307946713',
      publishingHouse: 'Vintage',
      publishedAt: '2009-06-15',
    },
  ];

  const insertedBooks = await db.insert(book).values(booksToInsert).returning();
  const insertedCategories = await db
    .insert(category)
    .values(categoriesToInsert)
    .returning();

  const links = insertedBooks.map((b, i) => ({
    bookId: b.id,
    categoryId:
      i < 12
        ? insertedCategories.find((c) => c.name === 'random')!.id
        : i < 24
          ? insertedCategories.find((c) => c.name === 'bestsellers')!.id
          : i < 36
            ? insertedCategories.find((c) => c.name === 'horror')!.id
            : insertedCategories.find((c) => c.name === 'love')!.id,
  }));

  await db.insert(bookCategory).values(links);

  console.log('Database seeded successfully! ✅');
}

seed().then(() => process.exit(0));
