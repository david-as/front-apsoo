import { lazy, Suspense } from "react";

const Topbar = lazy(() => import("@/components/top-bar"));

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<></>}>
        <Topbar />
      </Suspense>
      {children}
    </>
  );
}
