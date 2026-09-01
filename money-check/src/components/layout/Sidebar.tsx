import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface SidebarProps {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: "/", label: "Главная", icon: "🏠" },
    { to: "/incomes", label: "Доходы", icon: "💵" },
    { to: "/expenses", label: "Расходы", icon: "💳" },
    { to: "/budgets", label: "Бюджеты", icon: "📊" },
    { to: "/analytics", label: "Аналитика", icon: "📈" },
    { to: "/goals", label: "Цели", icon: "🎯" },
    { to: "/currency", label: "Курсы валют", icon: "💱" },
    { to: "/profile", label: "Профиль", icon: "👤" },
    { to: "/settings", label: "Настройки", icon: "⚙️" },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 p-4 flex flex-col overflow-y-auto">
      <div className="flex items-center gap-2 mb-1 px-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          F
        </div>
        <h2 className="text-base font-semibold text-white">FinanceTracker</h2>
      </div>
      {user && (
        <p className="text-xs text-slate-500 mb-6 px-2">
          {user.firstName} {user.lastName}
        </p>
      )}

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-300 font-medium"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-4"
      >
        🚪 Выйти
      </button>
    </aside>
  );
}

export default Sidebar;