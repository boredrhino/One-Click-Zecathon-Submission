import { useEffect, useState } from "react";

export type RouteName = "home" | "desk" | "docs" | "about";

export function routeFromPath(pathname: string): RouteName {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/desk") return "desk";
  if (path === "/docs") return "docs";
  if (path === "/about") return "about";
  return "home";
}

export function pathFor(route: RouteName): string {
  if (route === "home") return "/";
  return `/${route}`;
}

export function useRoute() {
  const [route, setRoute] = useState<RouteName>(() => routeFromPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(next: RouteName) {
    const path = pathFor(next);
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setRoute(next);
    window.scrollTo(0, 0);
  }

  return { route, go };
}
