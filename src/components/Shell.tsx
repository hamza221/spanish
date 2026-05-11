import { Sidebar } from "./Sidebar";

/** Standard app shell: 240px sidebar + canvas. Used for non-immersive routes. */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
