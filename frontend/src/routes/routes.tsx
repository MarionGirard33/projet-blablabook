import RootLayout from "@/layouts/RootLayout";
import RegisterPage from "@/pages/Auth/RegisterPage";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import LibraryPage from "@/pages/LibraryPage";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";

import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
  notFoundComponent: () => <NotFound />,
});

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
  component: () => <LibraryPage />,
});

// Profile ROUTE 
const profilePage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => <ProfilePage userId={1} />, // temporaire
});




const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  libraryRoute,
  profilePage
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
