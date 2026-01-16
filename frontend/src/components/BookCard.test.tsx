import { expect, it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookCard } from "@/components/BookCard";

const navigateMock = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ navigate: navigateMock }),
}));

// Static test data
const bookBase = {
  id: 1,
  name: "Test Book",
  coverId: "cover.jpg",
  author: "Author",
  description: "Description",
  isbn: "123",
  publishingHouse: "Publisher",
  publishedAt: "2024-01-01",
  categories: [],
  listName: "Ma liste",
  status: "À lire" as const,
  readStart: "2024-01-15",
  readEnd: "2024-01-31",
};

describe("BookCard", () => {
  it("renders the first category", () => {
    render(
      <BookCard
        book={{
          ...bookBase,
          categories: ["Fantasy", "Drama"],
        }}
        onRemove={() => undefined}
      />
    );

    expect(screen.getByText("Fantasy")).toBeInTheDocument();
  });

  it("calls onRemove when clicking the delete button", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <BookCard
        book={{
          ...bookBase,
          categories: ["Fantasy"],
        }}
        onRemove={onRemove}
      />
    );

    const deleteButton = screen.getByRole("button");
    await user.click(deleteButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render category badge when empty", () => {
    render(
      <BookCard
        book={{
          ...bookBase,
          categories: [],
        }}
        onRemove={() => undefined}
      />
    );

    expect(screen.queryByText("Fantasy")).not.toBeInTheDocument();
  });

  it("navigates to book details on card click", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <BookCard
        book={{
          ...bookBase,
          categories: ["Fantasy"],
        }}
        onRemove={() => undefined}
      />
    );

    const card = container.firstElementChild as HTMLElement;
    await user.click(card);

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/books/$isbn",
      params: { isbn: "123" },
    });
  });

  it("renders dropdown status options when onStatusChange is provided", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <BookCard
        book={{
          ...bookBase,
          status: "À lire",
          categories: ["Fantasy"],
        }}
        onRemove={() => undefined}
        onStatusChange={onStatusChange}
      />
    );

    await user.click(screen.getByText("À lire"));
    await user.click(screen.getByText("En cours"));

    expect(onStatusChange).toHaveBeenCalledWith("En cours");
  });
});
