import { createBrowserRouter } from "react-router";

import Room from "./Room";
import Root from "./Root";

export default createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Root },

      {
        path: "rooms",
        children: [{ path: ":roomId", Component: Room }],
      },
    ],
  },
]);
