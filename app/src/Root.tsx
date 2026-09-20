import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function Root(): React.JSX.Element {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();

  useEffect(() => {
    void (async () => {
      if (!isAuthenticated) {
        await signIn("anonymous");
      }
    })();
  }, [isAuthenticated, signIn]);

  if (!isAuthenticated) {
    return <div>Authenticating...</div>;
  }

  return <Outlet />;
}
