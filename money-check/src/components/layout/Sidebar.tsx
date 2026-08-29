import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface SidebarProps {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Главная" },
    { to: "/incomes", label: "Доходы" },
    { to: "/expenses", label: "Расходы" },
    { to: "/budgets", label: "Бюджеты" },
    { to: "/analytics", label: "Аналитика" },
    { to: "/goals", label: "Цели" },
    { to: "/currency", label: "Курсы валют" },
    { to: "/profile", label: "Профиль" },
    { to: "/settings", label: "Настройки" },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-56 h-full bg-gray-900 dark:bg-black text-white p-4 flex flex-col overflow-y-auto">
      <h2 className="text-xl font-bold mb-1">FinanceTracker</h2>
      {user && (
        <p className="text-sm text-gray-400 mb-6">
          {user.firstName} {user.lastName}
        </p>
      )}

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className="hover:text-blue-400"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 py-2 rounded mt-4"
      >
        Выйти
      </button>
    </aside>
  );
}

export default Sidebar;