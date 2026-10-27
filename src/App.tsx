import { Shell } from "./Shell";
import { About } from "./pages/About";
import { Desk } from "./pages/Desk";
import { Docs } from "./pages/Docs";
import { Home } from "./pages/Home";
import { useRoute } from "./router";

export function App() {
  const { route, go } = useRoute();
  return (
    <Shell route={route} go={go}>
      {route === "home" ? <Home go={go} /> : null}
      <div hidden={route !== "desk"}>
        <Desk />
      </div>
      {route === "docs" ? <Docs go={go} /> : null}
      {route === "about" ? <About go={go} /> : null}
    </Shell>
  );
}
