import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isUnlocked } from "@/lib/auth";

export default function RequireUnlock({ children }: { children: ReactNode }) {
  if (!isUnlocked()) return <Navigate to="/" replace />;
  return <>{children}</>;
}
