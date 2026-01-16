import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi, afterEach, type Mock } from "vitest";
import type { Book } from "@/@types/books";
import { useUserBooks } from "./useUserBooks";

vi.mock("@/api/books", () => ({
  getUserBooks: vi.fn(),
  removeBookFromUserList: vi.fn(),
  updateBookStatus: vi.fn(),
}));

const { getUserBooks, removeBookFromUserList, updateBookStatus } = await import(
  "@/api/books"
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("useUserBooks", () => {
  it("fetches books when userId is provided", async () => {
    const books: Book[] = [
      {
        id: 1,
        name: "Book A",
        author: "Author A",
        isbn: "111",
        coverId: "a.jpg",
        description: "desc",
        publishingHouse: "PH",
        publishedAt: "2024-01-01",
        categories: ["Fiction"],
      } as Book,
    ];

    (getUserBooks as Mock).mockResolvedValueOnce(books);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useUserBooks(10), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.books).toEqual(books);
    expect(getUserBooks).toHaveBeenCalledWith(10);
  });

  it("does not fetch when userId is missing", () => {
    const { wrapper } = createWrapper();
    renderHook(() => useUserBooks(undefined), { wrapper });

    expect(getUserBooks).not.toHaveBeenCalled();
  });

  it("removes a book and invalidates the cache", async () => {
    (removeBookFromUserList as Mock).mockResolvedValueOnce([{ id: 5 }]);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useUserBooks(3), { wrapper });

    await act(async () => {
      result.current.removeBook(5);
    });

    await waitFor(() => {
      expect(removeBookFromUserList).toHaveBeenCalledWith(3, 5);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["userBooks", 3],
      });
    });
  });

  it("updates book status via API", async () => {
    (updateBookStatus as Mock).mockResolvedValueOnce({ id: 2 } as Book);

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const currentBook = {
      id: 2,
      name: "Book B",
      author: "Author B",
      isbn: "222",
      coverId: "b.jpg",
      description: "desc",
      publishingHouse: "PH",
      publishedAt: "2024-02-02",
      categories: ["Fiction"],
    } as Book;

    const { result } = renderHook(() => useUserBooks(4), { wrapper });

    await act(async () => {
      result.current.updateStatus({ bookId: 2, status: "Lu", currentBook });
    });

    await waitFor(() => {
      expect(updateBookStatus).toHaveBeenCalledWith(4, 2, "Lu", currentBook);
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["userBooks", 4],
      });
    });
  });
});
