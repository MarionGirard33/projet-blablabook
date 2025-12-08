import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";
import LibraryPage from "@/pages/LibraryPage";

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

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: () => <LibraryPage />,
});

const routeTree = rootRoute.addChildren([homeRoute, libraryRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
