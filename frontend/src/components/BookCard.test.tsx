import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookCard } from "./BookCard";
import type { Book } from "@/@types/books";
import type { ReactNode } from "react";

interface WithChildren {
  children: ReactNode;
}

interface WithChildrenAndClassName extends WithChildren {
  className?: string;
}

interface WithChildrenAndonClick extends WithChildren {
  onClick?: () => void;
}

// Mock shadcn/ui dropdown and card to avoid portal/DOM quirks
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: WithChildren) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: WithChildren) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: WithChildren) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: WithChildrenAndonClick) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: WithChildrenAndClassName) => (
    <div className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: WithChildrenAndClassName) => (
    <div className={className}>{children}</div>
  ),
}));

describe("BookCard", () => {
  const baseBook: Book = {
    id: 1,
    name: "Test Book",
    author: "Test Author",
    description: "Test description",
    isbn: "123",
    publishingHouse: "Test House",
    publishedAt: "2023-01-01",
    coverId: "https://example.com/cover.jpg",
  };

  it("renders title, author, and description", () => {
    render(<BookCard book={baseBook} onRemove={vi.fn()} />);

    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Test Author")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("calls onRemove when delete is clicked", () => {
    const onRemove = vi.fn();
    // No status -> only delete button present
    render(
      <BookCard book={{ ...baseBook, status: undefined }} onRemove={onRemove} />
    );

    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("calls onStatusChange when selecting a new status", () => {
    const onStatusChange = vi.fn();
    render(
      <BookCard
        book={{ ...baseBook, status: "À lire" }}
        onRemove={vi.fn()}
        onStatusChange={onStatusChange}
      />
    );

    // Trigger dropdown and choose "Lu"
    const buttons = screen.getAllByRole("button");
    const statusTrigger = buttons.find((btn) => btn.textContent === "À lire");
    fireEvent.click(statusTrigger!);

    const luOption = screen.getByRole("button", { name: "Lu" });
    fireEvent.click(luOption);

    expect(onStatusChange).toHaveBeenCalledWith("Lu");
  });
});
