import { Outlet, Link } from "react-router-dom";

export function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <Link to="/" className="text-lg font-bold text-gray-800 no-underline">
          Korean Learning
        </Link>
      </header>
      <Outlet />
    </div>
  );
}
