import { createRoute } from "@tanstack/react-router";
import App from "../App";
import { rootRoute } from "../router";

// Update the home page later instead of App
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <App />,
});

export { indexRoute };
