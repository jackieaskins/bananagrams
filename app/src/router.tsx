import { createBrowserRouter } from "react-router";

import Home from "./Home";
import Room from "./Room";
import Root from "./Root";

export default createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },

      {
        path: "rooms",
        children: [{ path: ":roomId", Component: Room }],
      },
    ],
  },
]);
