import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const TEST_ACCOUNTS = [
  { username: "emilys", password: "emilyspass" },
];

function Register() {
  const [username, setUsername] = useState(TEST_ACCOUNTS[0].username);
  const [password, setPassword] = useState(TEST_ACCOUNTS[0].password);
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
      // ошибка уже в контексте
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="surface p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-2">Регистрация</h1>
        
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
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Создаём профиль..." : "Зарегистрироваться / Войти"}
        </button>

        <p className="text-sm text-secondary mt-4">
          Уже есть профиль?{" "}
          <Link to="/login" className="text-blue-600">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;