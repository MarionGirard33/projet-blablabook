import { createRouter, createRootRoute } from "@tanstack/react-router";
import RootLayout from "./routes/__root";
import { indexRoute } from "./routes/index";

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
