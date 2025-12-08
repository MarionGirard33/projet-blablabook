import RootLayout from "@/layouts/RootLayout";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";

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

const routeTree = rootRoute.addChildren([homeRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
