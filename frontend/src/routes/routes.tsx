import RootLayout from "@/layouts/RootLayout";
import { lazy } from "react";
import {
  createRouter,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

// Lazy-loaded pages for code splitting - each route downloads only when visited
const LoginPage = lazy(() => import("@/pages/Auth/LoginPage/LoginPage"));
const RegisterPage = lazy(
  () => import("@/pages/Auth/RegisterPage/RegisterPage"),
);
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const LibraryPage = lazy(() => import("@/pages/LibraryPage"));
const ProfileRoute = lazy(() => import("@/pages/ProfilePage/ProfileRoute"));
const BookDetails = lazy(() => import("@/pages/Book/BookDetails"));
const SeeAllPage = lazy(() => import("@/pages/SeeAllPage"));
const PrivacyPage = lazy(() => import("@/pages/PrivacyPolicy"));
const CGUPage = lazy(() => import("@/pages/CGU"));
const LegalNoticePage = lazy(() => import("@/pages/MentionsLegales"));

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
});

// Protected route - checks authentication before allowing access to child routes
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const seeAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/see-all",
  component: () => <SeeAllPage />,
});

const registerPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <RegisterPage />,
});

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

// Protected route - user must be authenticated
const libraryRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/library",
  component: () => <LibraryPage />,
});

// Protected route - user must be authenticated
const profilePage = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/profile",
  component: ProfileRoute,
});

// Dynamic route with ISBN parameter: /books/:isbn
export const bookDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$isbn",
  component: () => <BookDetails />,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: () => <PrivacyPage />,
});

const CGURoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cgu",
  component: () => <CGUPage />,
});

const legalNoticeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal-notice",
  component: () => <LegalNoticePage />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage,
  seeAllRoute,
  privacyRoute,
  CGURoute,
  legalNoticeRoute,
  bookDetailsRoute,
  protectedRoute.addChildren([libraryRoute, profilePage]),
]);

// defaultPreload: "intent" - preloads code chunks on hover for instant navigation
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
