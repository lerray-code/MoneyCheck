import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Login() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [submitting, setSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      // ошибка уже лежит в error из контекста
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="surface p-8 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Вход</h1>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <label className="block mb-1 text-sm">Логин</label>
        <input
          className="border w-full p-2 mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-1 text-sm">Пароль</label>
        <input
          type="password"
          className="border w-full p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Входим..." : "Войти"}
        </button>

        <p className="text-sm text-secondary mt-4">
          Нет аккаунта?{" "}
          <Link to="/register" className="text-blue-600">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;