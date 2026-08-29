import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 dark:text-gray-100 transition-colors">
      {/* Затемнение фона на мобильных, когда меню открыто */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Сайдбар - теперь fixed всегда, независимо от размера экрана */}
      <div
        className={`fixed top-0 left-0 h-screen w-56 z-50 transition-transform duration-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Контент справа - отступ слева на десктопе равен ширине сайдбара (w-56 = 14rem = 224px) */}
      <div className="flex flex-col min-w-0 md:ml-56">
        <header className="md:hidden bg-white dark:bg-gray-900 shadow p-4 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl"
            aria-label="Открыть меню"
          >
            ☰
          </button>
          <span className="font-bold">FinanceTracker</span>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;