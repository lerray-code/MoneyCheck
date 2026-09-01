import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen surface-alt text-primary transition-colors">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-col min-w-0 md:ml-64">
        <header className="md:hidden surface shadow-sm p-4 flex items-center gap-3 sticky top-0 z-30 border-b" style={{ borderColor: "var(--color-border)" }}>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl"
            aria-label="Открыть меню"
          >
            ☰
          </button>
          <span className="font-semibold">FinanceTracker</span>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;