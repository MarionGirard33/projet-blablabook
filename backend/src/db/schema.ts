

import { users } from '../user/user.schema';

export const schema = {
  users,
};


// export const lists = pgTable('list', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
//   deletedAt: timestamp('deleted_at'),
//   userId: integer('user_id')
//     .notNull()
//     .references(() => users.id),
// });

// export const categories = pgTable('category', {
//   id: serial('id').primaryKey(),
//   name: text('name').unique().notNull(),
//   isActive: boolean('is_active').default(true).notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
//   deletedAt: timestamp('deleted_at'),
// });

// export const books = pgTable('book', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   cover: text('cover').notNull(),
//   author: text('author').notNull(),
//   description: text('description').notNull(),
//   isbn: text('isbn').unique().notNull(),
//   publishingHouse: text('publishing_house').notNull(),
//   publishedAt: timestamp('published_at').notNull(),
//   createdAt: timestamp('created_at').defaultNow().notNull(),
//   updatedAt: timestamp('updated_at').defaultNow().notNull(),
//   deletedAt: timestamp('deleted_at'),
// });

// // Table d'association ListBook (M:N entre List et Book)
// export const listBooks = pgTable(
//   'list_book',
//   {
//     id: serial('id').primaryKey(),
//     comment: text('comment').notNull(),
//     readStart: timestamp('read_start'),
//     readEnd: timestamp('read_end'),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
//     updatedAt: timestamp('updated_at').defaultNow().notNull(),
//     deletedAt: timestamp('deleted_at'),
//     bookId: integer('book_id')
//       .notNull()
//       .references(() => books.id),
//     listId: integer('list_id')
//       .notNull()
//       .references(() => lists.id),
//   },
//   (t) => ({
//     // Contrainte @@unique([listId, bookId])
//     unqListBook: unique().on(t.listId, t.bookId),
//   }),
// );

// // Table d'association UserCategory (M:N entre User et Category)
// export const userCategories = pgTable(
//   'user_category',
//   {
//     id: serial('id').primaryKey(),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
//     updatedAt: timestamp('updated_at').defaultNow().notNull(),
//     deletedAt: timestamp('deleted_at'),
//     categoryId: integer('category_id')
//       .notNull()
//       .references(() => categories.id),
//     userId: integer('user_id')
//       .notNull()
//       .references(() => users.id),
//   },
//   (t) => ({
//     // Contrainte @@unique([categoryId, userId])
//     unqUserCategory: unique().on(t.categoryId, t.userId),
//   }),
// );

// // Table d'association BookCategory (M:N entre Book et Category)
// export const bookCategories = pgTable(
//   'book_category',
//   {
//     id: serial('id').primaryKey(),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
//     updatedAt: timestamp('updated_at').defaultNow().notNull(),
//     deletedAt: timestamp('deleted_at'),
//     categoryId: integer('category_id')
//       .notNull()
//       .references(() => categories.id),
//     bookId: integer('book_id')
//       .notNull()
//       .references(() => books.id),
//   },
//   (t) => ({
//     // Contrainte @@unique([categoryId, bookId])
//     unqBookCategory: unique().on(t.categoryId, t.bookId),
//   }),
// );

// // --- Définition des Relations (pour les requêtes Relationnelles) ---

// export const userRelations = relations(users, ({ many }) => ({
//   lists: many(lists), // Relation 1:N vers List
//   userCategory: many(userCategories), // Relation M:N via UserCategory
// }));

// export const listRelations = relations(lists, ({ one, many }) => ({
//   user: one(users, {
//     fields: [lists.userId],
//     references: [users.id],
//   }), // Relation N:1 vers User
//   listBook: many(listBooks), // Relation M:N via ListBook
// }));

// export const categoryRelations = relations(categories, ({ many }) => ({
//   userCategory: many(userCategories), // Relation M:N via UserCategory
//   bookCategory: many(bookCategories), // Relation M:N via BookCategory
// }));

// export const bookRelations = relations(books, ({ many }) => ({
//   listBook: many(listBooks), // Relation M:N via ListBook
//   bookCategory: many(bookCategories), // Relation M:N via BookCategory
// }));

// export const listBookRelations = relations(listBooks, ({ one }) => ({
//   list: one(lists, {
//     fields: [listBooks.listId],
//     references: [lists.id],
//   }),
//   book: one(books, {
//     fields: [listBooks.bookId],
//     references: [books.id],
//   }),
// }));

// export const userCategoryRelations = relations(userCategories, ({ one }) => ({
//   user: one(users, {
//     fields: [userCategories.userId],
//     references: [users.id],
//   }),
//   category: one(categories, {
//     fields: [userCategories.categoryId],
//     references: [categories.id],
//   }),
// }));

// export const bookCategoryRelations = relations(bookCategories, ({ one }) => ({
//   book: one(books, {
//     fields: [bookCategories.bookId],
//     references: [books.id],
//   }),
//   category: one(categories, {
//     fields: [bookCategories.categoryId],
//     references: [categories.id],
//   }),
// }));
