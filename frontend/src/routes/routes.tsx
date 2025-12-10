import RootLayout from "@/layouts/RootLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
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

// AUTH ROUTE =======================
const registerPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => <RegisterPage />
})

const loginPage = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginPage />
})
// =====================================

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerPage,
  loginPage
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

export { rootRoute };
