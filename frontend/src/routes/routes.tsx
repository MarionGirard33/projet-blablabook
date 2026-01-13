import RootLayout from "@/layouts/RootLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import LibraryPage from "@/pages/LibraryPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import BookDetails from "@/pages/Book/BookDetails";
import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthStore } from "@/stores/authStore";

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
});

// PROTECTED ROUTE
// This parent route protects all its child routes by checking if the user is authenticated.
// If not authenticated, it redirects to the login page.
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
});

// HOME ROUTE
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

// AUTH ROUTE
const registerPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <RegisterPage />,
});

// LOGIN ROUTE
const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

// LIBRARY ROUTE
const libraryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/library",
  component: () => <LibraryPage />,
});

// PROFILE ROUTE
const profilePage = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile",
  component: () => {
    const { data } = useCurrentUser();
    if (data) {
      return <ProfilePage userId={data?.id} />;
    }
  },
});

// DETAILS BOOK ROUTE
export const bookDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$isbn",
  component: () => <BookDetails />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage,
  bookDetailsRoute,
  protectedRoute.addChildren([libraryRoute, profilePage]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
