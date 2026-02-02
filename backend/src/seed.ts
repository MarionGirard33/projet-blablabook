import { db } from './db';
import { book, bookCategory, category } from './db/schema';

async function seed() {
  console.log('Seeding database...');

  const categoriesToInsert = [
    { name: 'random' },
    { name: 'bestsellers' },
    { name: 'horror' },
  ];

  const booksToInsert = [
    // RANDOM
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
      name: 'Wuthering Heights',
      coverId: 'https://covers.openlibrary.org/b/id/8231852-L.jpg',
      author: 'Emily Brontë',
      description: 'A stormy tale of passion on the Yorkshire moors.',
      isbn: '9780141439556',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1847-12-01',
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
      name: 'Anna Karenina',
      coverId: 'https://covers.openlibrary.org/b/id/8339256-L.jpg',
      author: 'Leo Tolstoy',
      description: 'A tragic tale of love and society in Imperial Russia.',
      isbn: '9780143035008',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1877-01-01',
    },

    // BESTSELLERS
    {
      name: 'The Da Vinci Code',
      coverId: 'https://covers.openlibrary.org/b/id/8232001-L.jpg',
      author: 'Dan Brown',
      description: 'A thrilling mystery involving secret societies.',
      isbn: '9780307474278',
      publishingHouse: 'Anchor',
      publishedAt: '2003-03-18',
    },
    {
      name: "Harry Potter and the Sorcerer's Stone",
      coverId: 'https://covers.openlibrary.org/b/id/8232002-L.jpg',
      author: 'J.K. Rowling',
      description: 'The first adventure of Harry Potter.',
      isbn: '9780590353427',
      publishingHouse: 'Scholastic',
      publishedAt: '1997-06-26',
    },
    {
      name: 'The Girl with the Dragon Tattoo',
      coverId: 'https://covers.openlibrary.org/b/id/8232003-L.jpg',
      author: 'Stieg Larsson',
      description: 'A gripping Swedish crime thriller.',
      isbn: '9780307454546',
      publishingHouse: 'Vintage',
      publishedAt: '2005-08-01',
    },
    {
      name: 'Gone Girl',
      coverId: 'https://covers.openlibrary.org/b/id/8232004-L.jpg',
      author: 'Gillian Flynn',
      description: 'A psychological thriller about a missing wife.',
      isbn: '9780307588371',
      publishingHouse: 'Crown',
      publishedAt: '2012-06-05',
    },
    {
      name: 'The Hunger Games',
      coverId: 'https://covers.openlibrary.org/b/id/8232005-L.jpg',
      author: 'Suzanne Collins',
      description: 'A dystopian fight for survival.',
      isbn: '9780439023528',
      publishingHouse: 'Scholastic',
      publishedAt: '2008-09-14',
    },
    {
      name: 'Twilight',
      coverId: 'https://covers.openlibrary.org/b/id/8232006-L.jpg',
      author: 'Stephenie Meyer',
      description: 'A vampire romance phenomenon.',
      isbn: '9780316015844',
      publishingHouse: 'Little, Brown and Company',
      publishedAt: '2005-10-05',
    },
    {
      name: 'Fifty Shades of Grey',
      coverId: 'https://covers.openlibrary.org/b/id/8232007-L.jpg',
      author: 'E.L. James',
      description: 'A romance that became a global bestseller.',
      isbn: '9780345803481',
      publishingHouse: 'Vintage',
      publishedAt: '2011-06-20',
    },
    {
      name: 'The Alchemist',
      coverId: 'https://covers.openlibrary.org/b/id/8232008-L.jpg',
      author: 'Paulo Coelho',
      description: 'A philosophical journey of self-discovery.',
      isbn: '9780061122415',
      publishingHouse: 'HarperOne',
      publishedAt: '1988-01-01',
    },
    {
      name: 'To Kill a Mockingbird',
      coverId: 'https://covers.openlibrary.org/b/id/8232009-L.jpg',
      author: 'Harper Lee',
      description: 'A classic novel of justice and race.',
      isbn: '9780060935467',
      publishingHouse: 'Harper Perennial',
      publishedAt: '1960-07-11',
    },
    {
      name: 'The Great Gatsby',
      coverId: 'https://covers.openlibrary.org/b/id/8232010-L.jpg',
      author: 'F. Scott Fitzgerald',
      description: 'A story of wealth, love, and tragedy in the Jazz Age.',
      isbn: '9780743273565',
      publishingHouse: 'Scribner',
      publishedAt: '1925-04-10',
    },

    // HORROR
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
      name: 'The Shining',
      coverId: 'https://covers.openlibrary.org/b/id/8231991-L.jpg',
      author: 'Stephen King',
      description: 'A haunted hotel and a family in peril.',
      isbn: '9780307743657',
      publishingHouse: 'Anchor',
      publishedAt: '1977-01-28',
    },
    {
      name: 'It',
      coverId: 'https://covers.openlibrary.org/b/id/8231992-L.jpg',
      author: 'Stephen King',
      description: 'A terrifying entity haunts a small town.',
      isbn: '9780450411434',
      publishingHouse: 'Viking',
      publishedAt: '1986-09-15',
    },
    {
      name: 'The Exorcist',
      coverId: 'https://covers.openlibrary.org/b/id/8231994-L.jpg',
      author: 'William Peter Blatty',
      description: 'A young girl possessed by a demon.',
      isbn: '9780061007224',
      publishingHouse: 'Harper',
      publishedAt: '1971-06-01',
    },
    {
      name: 'Pet Sematary',
      coverId: 'https://covers.openlibrary.org/b/id/8231995-L.jpg',
      author: 'Stephen King',
      description: 'A burial ground with dark secrets.',
      isbn: '9780743412285',
      publishingHouse: 'Pocket Books',
      publishedAt: '1983-11-14',
    },
    {
      name: 'The Haunting of Hill House',
      coverId: 'https://covers.openlibrary.org/b/id/8231997-L.jpg',
      author: 'Shirley Jackson',
      description: 'A chilling haunted house story.',
      isbn: '9780141191442',
      publishingHouse: 'Penguin Classics',
      publishedAt: '1959-10-16',
    },
    {
      name: 'American Psycho',
      coverId: 'https://covers.openlibrary.org/b/id/8231998-L.jpg',
      author: 'Bret Easton Ellis',
      description: 'A disturbing psychological horror.',
      isbn: '9780679735779',
      publishingHouse: 'Vintage',
      publishedAt: '1991-03-06',
    },
    {
      name: 'The Silence of the Lambs',
      coverId: 'https://covers.openlibrary.org/b/id/8231999-L.jpg',
      author: 'Thomas Harris',
      description: 'A psychological thriller with a serial killer.',
      isbn: '9780312924584',
      publishingHouse: "St. Martin's Press",
      publishedAt: '1988-05-19',
    },
    {
      name: 'Carrie',
      coverId: 'https://covers.openlibrary.org/b/id/8232000-L.jpg',
      author: 'Stephen King',
      description: 'A bullied girl discovers her powers.',
      isbn: '9780307743664',
      publishingHouse: 'Anchor',
      publishedAt: '1974-04-05',
    },
    {
      name: 'Bird Box',
      coverId: 'https://covers.openlibrary.org/b/id/8232011-L.jpg',
      author: 'Josh Malerman',
      description: 'A post-apocalyptic horror thriller.',
      isbn: '9780062259653',
      publishingHouse: 'Ecco',
      publishedAt: '2014-03-27',
    },
  ];

  const insertedBooks = await db.insert(book).values(booksToInsert).returning();

  if (!insertedBooks || insertedBooks.length !== booksToInsert.length)
    throw new Error('Books insert failed');

  const insertedCategories = await db
    .insert(category)
    .values(categoriesToInsert)
    .returning();

  const bookCategoryLinks: { bookId: number; categoryId: number }[] = [];

  for (let i = 0; i < 10; i++) {
    bookCategoryLinks.push({
      bookId: insertedBooks[i].id,
      categoryId: insertedCategories.find((c) => c.name === 'random')!.id,
    });
  }
  for (let i = 10; i < 20; i++) {
    bookCategoryLinks.push({
      bookId: insertedBooks[i].id,
      categoryId: insertedCategories.find((c) => c.name === 'bestsellers')!.id,
    });
  }
  for (let i = 20; i < 30; i++) {
    bookCategoryLinks.push({
      bookId: insertedBooks[i].id,
      categoryId: insertedCategories.find((c) => c.name === 'horror')!.id,
    });
  }

  await db.insert(bookCategory).values(bookCategoryLinks);

  console.log('Database seeded successfully! ✅');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
