import { createRouter, createRootRoute } from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout";
import { indexRoute } from "./routes/Index";

const rootRoute = createRootRoute({
  component: () => <RootLayout />,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
