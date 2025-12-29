import RootLayout from "@/layouts/RootLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import LibraryPage from "@/pages/LibraryPage";
import BookDetails from "@/pages/BookDetails";
import { useAuthStore } from "@/stores/authStore";

import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
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

// LIBRARY ROUTE
const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <LibraryPage />,
});

// LOGIN ROUTE
const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

// DETAILS BOOK ROUTE
const bookDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/:id",
  component: () => <BookDetails />,
});
// =====================================

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage,
  libraryRoute,
  bookDetailsRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
