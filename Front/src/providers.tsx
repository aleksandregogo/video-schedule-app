import { AuthProvider } from "@/contexts/authProvider";
import React, { Suspense} from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
};
