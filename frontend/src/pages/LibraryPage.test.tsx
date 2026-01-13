import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LibraryPage from "./LibraryPage";
import { useAuthStore } from "@/stores/authStore";

// Mock the hooks
vi.mock("@/hooks/useUserBooks", () => ({
  useUserBooks: vi.fn(() => ({
    books: [
      {
        id: 1,
        name: "Test Book",
        author: "Test Author",
        isbn: "1234567890",
        description: "A test book",
        status: "Lu",
        publishingHouse: "Test House",
        publishedAt: "2023-01-01",
        coverId: "cover1",
      },
    ],
    refetch: vi.fn(),
    removeBook: vi.fn(),
    updateStatus: vi.fn(),
  })),
}));

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

vi.mock("@/components/AddBookModal", () => ({
  AddBookModal: ({ isOpen, onClose }: AddBookModalProps) =>
    isOpen ? (
      <div data-testid="add-book-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null,
}));

describe("LibraryPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock auth store
    useAuthStore.setState({
      user: {
        id: 1,
        email: "test@test.com",
        username: "testuser",
        image: "",
        roles: "USER",
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

  it("should render the library page with title", () => {
    renderWithProviders(<LibraryPage />);
    expect(screen.getByText("Ma Bibliothèque")).toBeInTheDocument();
  });

  it("should display the add button", () => {
    renderWithProviders(<LibraryPage />);
    const addButton = screen.getByRole("button", { name: /search books/i });
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent(/ajouter/i);
  });

  it("should open the modal when add button is clicked", () => {
    renderWithProviders(<LibraryPage />);
    const addButton = screen.getByRole("button", { name: /search books/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId("add-book-modal")).toBeInTheDocument();
  });

  it("should display reading status counters", () => {
    renderWithProviders(<LibraryPage />);
    expect(screen.getByText(/lus/i)).toBeInTheDocument();
    expect(screen.getByText(/en cours/i)).toBeInTheDocument();
    expect(screen.getByText(/à lire/i)).toBeInTheDocument();
  });

  it("should display search input", () => {
    renderWithProviders(<LibraryPage />);
    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("should filter books by title", async () => {
    renderWithProviders(<LibraryPage />);
    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);

    fireEvent.change(searchInput, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });
  });

  it("should show no books message when search returns nothing", async () => {
    renderWithProviders(<LibraryPage />);
    const searchInput = screen.getByPlaceholderText(/rechercher un livre/i);

    fireEvent.change(searchInput, { target: { value: "NonExistentBook" } });

    await waitFor(() => {
      expect(screen.getByText(/aucun livre trouvé/i)).toBeInTheDocument();
    });
  });
});
