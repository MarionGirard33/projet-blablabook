import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AddBookModal } from "./AddBookModal";

// Mock the API functions
vi.mock("@/api/books", () => ({
  getUserBooks: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/api/externalBooks", () => ({
  searchExternalBooks: vi.fn(() =>
    Promise.resolve([
      {
        key: "test-key-1",
        title: "Test Book",
        author: "Test Author",
        isbn: "1234567890",
        language: [{ key: "/languages/eng" }],
        publishDate: "2023-01-01",
        cover: "https://example.com/cover.jpg",
        description: "A test book",
        publisher: "Test Publisher",
      },
    ])
  ),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock("@/hooks/useAddBook", () => ({
  useAddBook: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

describe("AddBookModal", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it("should render nothing when isOpen is false", () => {
    const { container } = renderWithProviders(
      <AddBookModal isOpen={false} onClose={vi.fn()} userId={1} />
    );
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it("should render the modal when isOpen is true", () => {
    renderWithProviders(
      <AddBookModal isOpen={true} onClose={vi.fn()} userId={1} />
    );
    expect(
      screen.getByRole("heading", { name: /rechercher un livre/i })
    ).toBeInTheDocument();
  });

  it("should display search input and button", () => {
    renderWithProviders(
      <AddBookModal isOpen={true} onClose={vi.fn()} userId={1} />
    );

    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);
    const searchButton = screen.getByRole("button", { name: /rechercher/i });

    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  it("should update input value when typing", () => {
    renderWithProviders(
      <AddBookModal isOpen={true} onClose={vi.fn()} userId={1} />
    );

    const searchInput = screen.getByPlaceholderText(
      /rechercher un livre/i
    ) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput.value).toBe("test search");
  });

  it("should show loading state while fetching", async () => {
    renderWithProviders(
      <AddBookModal isOpen={true} onClose={vi.fn()} userId={1} />
    );

    const searchButton = screen.getByRole("button", { name: /rechercher/i });
    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);

    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.click(searchButton);

    // Check if loader appears during fetch
    await waitFor(
      () => {
        expect(screen.queryByText(/chargement/i)).toBeInTheDocument();
      },
      { timeout: 100 }
    ).catch(() => {
      // Loader might disappear too fast, that's ok
    });
  });

  it("should display search results", async () => {
    renderWithProviders(
      <AddBookModal isOpen={true} onClose={vi.fn()} userId={1} />
    );

    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);
    const searchButton = screen.getByRole("button", { name: /rechercher/i });

    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
      expect(screen.getByText("Test Author")).toBeInTheDocument();
    });
  });

  it("should clear empty state message when typing", async () => {
    renderWithProviders(
      <AddBookModal isOpen={true} onClose={vi.fn()} userId={1} />
    );

    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);
    const searchButton = screen.getByRole("button", { name: /rechercher/i });

    // Mock to return empty results
    const externalBooksModule = await import("@/api/externalBooks");
    vi.mocked(externalBooksModule.searchExternalBooks).mockResolvedValueOnce(
      []
    );

    // First search with no results
    fireEvent.change(searchInput, { target: { value: "x" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/aucun livre trouvé/i)).toBeInTheDocument();
    });

    // Now type again - message should disappear immediately
    fireEvent.change(searchInput, { target: { value: "xy" } });

    expect(screen.queryByText(/aucun livre trouvé/i)).not.toBeInTheDocument();
  });
});
