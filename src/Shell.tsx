import type { ReactNode } from "react";
import type { RouteName } from "./router";

const NAV: { route: RouteName; label: string }[] = [
  { route: "home", label: "Home" },
  { route: "desk", label: "Desk" },
  { route: "docs", label: "Docs" },
  { route: "about", label: "About" },
];

export function Shell({
  route,
  go,
  children,
}: {
  route: RouteName;
  go: (route: RouteName) => void;
  children: ReactNode;
}) {
  return (
    <div className="site">
      <a className="skip" href="#content" onClick={(event) => event.preventDefault()}>
        Skip to content
      </a>
      <header className="nav">
        <button type="button" className="brand" onClick={() => go("home")}>
          <Mark />
          <span>ONCE</span>
        </button>
        <nav aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.route}
              type="button"
              className={route === item.route ? "nav-link is-current" : "nav-link"}
              aria-current={route === item.route ? "page" : undefined}
              onClick={() => go(item.route)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button type="button" className="btn solid nav-cta" onClick={() => go("desk")}>
          Open the desk
        </button>
      </header>
      <main id="content">{children}</main>
      <footer className="site-foot">
        <div>
          <button type="button" className="brand" onClick={() => go("home")}>
            <Mark />
            <span>ONCE</span>
          </button>
          <p>
            A shielded ZEC arrival with one address and one viewing key. The next swap is a
            new seed.
          </p>
        </div>
        <div>
          <p className="foot-label">Product</p>
          <ul>
            {NAV.map((item) => (
              <li key={item.route}>
                <button type="button" className="text" onClick={() => go(item.route)}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="foot-label">The key</p>
          <p>
            The seed and the viewing key stay in this tab. A quote carries the Orchard address
            and nothing else from the key.
          </p>
          <p className="fine">Once does not take custody. A dry quote does not move funds.</p>
        </div>
      </footer>
    </div>
  );
}

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
