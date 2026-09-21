import { useSessionMutation } from "convex-helpers/react/sessions";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import { api } from "../convex/_generated/api";

export default function Root(): React.JSX.Element {
  const [sessionExists, setSessionExists] = useState(false);
  const initializeSession = useSessionMutation(api.session.initialize);

  useEffect(() => {
    async function init() {
      await initializeSession();
      setSessionExists(true);
    }

    if (!sessionExists) {
      void init();
    }
  }, [initializeSession, sessionExists]);

  if (!sessionExists) {
    return <div>Authenticating...</div>;
  }

  return <Outlet />;
}
