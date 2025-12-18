import RootLayout from "@/layouts/RootLayout";
import LoginPage from "@/pages/Auth/LoginPage";
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
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  component: () => <LibraryPage />,
});

// LOGIN ROUTE
const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />,
});

// Profile ROUTE 
const profilePage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => {
    const { data: currentUser, isLoading, isError } = useCurrentUser();

    if (isLoading) return <div>Chargement...</div>;
    if (isError || !currentUser) return <div>Impossible de charger le profil</div>;

    return <ProfilePage userId={currentUser.id} />;
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage,
  libraryRoute,
  profilePage
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
