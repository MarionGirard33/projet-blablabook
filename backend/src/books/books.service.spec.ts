import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { CategoryService } from '../category/category.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let mockDb: any;
  let mockCategoryService: any;

  beforeEach(async () => {
    // Mock database operations
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      onConflictDoNothing: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    };

    // Mock category service
    mockCategoryService = {
      findOrCreateByName: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: 'DRIZZLE',
          useValue: mockDb,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllBooks', () => {
    it('should return all books from the database', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1', author: 'Author 1', isbn: '1234567890' },
        { id: 2, name: 'Book 2', author: 'Author 2', isbn: '0987654321' },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockResolvedValue(mockBooks),
      });

      const result = await service.findAllBooks();

      expect(result).toEqual(mockBooks);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe('findUserBooks', () => {
    it('should return user books with computed status and categories', async () => {
      const userId = 1;
      const mockRows = [
        {
          id: 1,
          name: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
          coverId: 'cover1',
          description: 'Description 1',
          publishingHouse: 'House 1',
          publishedAt: '2023-01-01',
          readStart: new Date('2024-01-01'),
          readEnd: null,
          addedAt: new Date('2024-01-01'),
        },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue(mockRows),
              }),
            }),
          }),
        }),
      });

      // Mock getCategoriesForBook
      jest
        .spyOn(service, 'getCategoriesForBook')
        .mockResolvedValue([{ id: 1, name: 'Fiction' }]);

      const result = await service.findUserBooks(userId);

      expect(result).toHaveLength(1);
      expect((result[0] as any).status).toBe('En cours');
      expect((result[0] as any).categories).toEqual(['Fiction']);
    });

    it('should compute status as "À lire" when no dates are set', async () => {
      const userId = 1;
      const mockRows = [
        {
          id: 1,
          name: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
          coverId: 'cover1',
          description: 'Description 1',
          publishingHouse: 'House 1',
          publishedAt: '2023-01-01',
          readStart: null,
          readEnd: null,
          addedAt: new Date('2024-01-01'),
        },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue(mockRows),
              }),
            }),
          }),
        }),
      });

      jest.spyOn(service, 'getCategoriesForBook').mockResolvedValue([]);

      const result = await service.findUserBooks(userId);

      expect((result[0] as any).status).toBe('À lire');
    });

    it('should compute status as "Lu" when readEnd is set', async () => {
      const userId = 1;
      const mockRows = [
        {
          id: 1,
          name: 'Book 1',
          author: 'Author 1',
          isbn: '1234567890',
          coverId: 'cover1',
          description: 'Description 1',
          publishingHouse: 'House 1',
          publishedAt: '2023-01-01',
          readStart: new Date('2024-01-01'),
          readEnd: new Date('2024-02-01'),
          addedAt: new Date('2024-01-01'),
        },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            innerJoin: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockResolvedValue(mockRows),
              }),
            }),
          }),
        }),
      });

      jest.spyOn(service, 'getCategoriesForBook').mockResolvedValue([]);

      const result = await service.findUserBooks(userId);

      expect((result[0] as any).status).toBe('Lu');
    });
  });

  describe('addToUserList', () => {
    const userId = 1;
    const createBookDto = {
      name: 'New Book',
      author: 'New Author',
      isbn: '1234567890',
      coverId: 'cover123',
      description: 'A new book',
      publishingHouse: 'New House',
      publishedAt: '2023-01-01',
      categories: ['Fiction', 'Adventure'],
    };

    it('should create a new book if it does not exist', async () => {
      const newBook = { id: 1, ...createBookDto };

      // Mock book not found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        })
        // Mock list found
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ id: 1, userId }]),
          }),
        });

      // Mock book insert and listBook insert
      mockDb.insert = jest
        .fn()
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([newBook]),
          }),
        })
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        });

      jest
        .spyOn(service, 'assignCategoriesFromNames')
        .mockResolvedValue(undefined);

      const result = await service.addToUserList(userId, createBookDto);

      expect(result).toEqual(newBook);
    });

    it('should use existing book if it exists by ISBN', async () => {
      const existingBook = { id: 1, ...createBookDto };

      // Mock book found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([existingBook]),
          }),
        })
        // Mock list found
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ id: 1, userId }]),
          }),
        });

      // Mock listBook insert
      mockDb.insert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([]),
        }),
      });

      jest
        .spyOn(service, 'assignCategoriesFromNames')
        .mockResolvedValue(undefined);

      const result = await service.addToUserList(userId, createBookDto);

      expect(result).toEqual(existingBook);
    });

    it('should create user list if it does not exist', async () => {
      const newBook = { id: 1, ...createBookDto };
      const newList = { id: 1, name: 'My List', userId };

      // Mock book not found, then list not found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        })
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([]),
          }),
        });

      // Mock book insert and list insert
      mockDb.insert = jest
        .fn()
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([newBook]),
          }),
        })
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([newList]),
          }),
        })
        .mockReturnValueOnce({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        });

      jest
        .spyOn(service, 'assignCategoriesFromNames')
        .mockResolvedValue(undefined);

      const result = await service.addToUserList(userId, createBookDto);

      expect(result).toEqual(newBook);
    });

    it('should throw HttpException on database error', async () => {
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      });

      await expect(
        service.addToUserList(userId, createBookDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('removeFromUserList', () => {
    it('should remove book from user list', async () => {
      const userId = 1;
      const bookId = 1;
      const deletedRow = { bookId, listId: 1 };

      // Mock list found
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ id: 1, userId }]),
        }),
      });

      // Mock delete
      mockDb.delete = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([deletedRow]),
        }),
      });

      const result = await service.removeFromUserList(userId, bookId);

      expect(result).toEqual([deletedRow]);
    });
  });

  describe('updateBookStatus', () => {
    it('should update book reading dates and return computed status', async () => {
      const userId = 1;
      const bookId = 1;
      const readStart = new Date('2024-01-01');
      const readEnd = new Date('2024-02-01');
      const mockBook = {
        id: bookId,
        name: 'Book 1',
        author: 'Author 1',
        isbn: '1234567890',
      };

      // Mock list found
      mockDb.select = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([{ id: 1, userId }]),
          }),
        })
        // Mock book found
        .mockReturnValueOnce({
          from: jest.fn().mockReturnValue({
            where: jest.fn().mockResolvedValue([mockBook]),
          }),
        });

      // Mock update
      mockDb.update = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest
              .fn()
              .mockResolvedValue([{ bookId, listId: 1, readStart, readEnd }]),
          }),
        }),
      });

      const result = await service.updateBookStatus(
        userId,
        bookId,
        readStart,
        readEnd,
      );

      expect((result as any).status).toBe('Lu');
      expect((result as any).readStart).toEqual(readStart);
      expect((result as any).readEnd).toEqual(readEnd);
    });

    it('should throw HttpException if book not found in user list', async () => {
      const userId = 1;
      const bookId = 1;
      const readStart = new Date('2024-01-01');
      const readEnd = null;

      // Mock list found
      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([{ id: 1, userId }]),
        }),
      });

      // Mock update returns empty
      mockDb.update = jest.fn().mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(
        service.updateBookStatus(userId, bookId, readStart, readEnd),
      ).rejects.toThrow(
        new HttpException('Book not found in user list', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getCategoriesForBook', () => {
    it('should return categories for a given book', async () => {
      const bookId = 1;
      const mockCategories = [
        { id: 1, name: 'Fiction' },
        { id: 2, name: 'Adventure' },
      ];

      mockDb.select = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockReturnValue({
                execute: jest.fn().mockResolvedValue(mockCategories),
              }),
            }),
          }),
        }),
      });

      const result = await service.getCategoriesForBook(bookId);

      expect(result).toEqual(mockCategories);
    });
  });

  describe('assignCategoriesFromNames', () => {
    it('should assign categories to a book', async () => {
      const bookId = 1;
      const categoryNames = ['Fiction', 'Adventure'];
      const mockCategory = { id: 1, name: 'Fiction' };

      mockCategoryService.findOrCreateByName.mockResolvedValue(mockCategory);

      mockDb.insert = jest.fn().mockReturnValue({
        values: jest.fn().mockReturnValue({
          onConflictDoNothing: jest.fn().mockReturnValue({
            execute: jest.fn().mockResolvedValue(undefined),
          }),
        }),
      });

      await service.assignCategoriesFromNames(bookId, categoryNames);

      expect(mockCategoryService.findOrCreateByName).toHaveBeenCalledTimes(2);
      expect(mockCategoryService.findOrCreateByName).toHaveBeenCalledWith(
        'Fiction',
      );
      expect(mockCategoryService.findOrCreateByName).toHaveBeenCalledWith(
        'Adventure',
      );
    });
  });
});
