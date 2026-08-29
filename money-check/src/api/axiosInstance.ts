import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      toast.error(
        "Не удалось подключиться к серверу данных. Проверьте, что json-server запущен."
      );
    } else if (error.response) {
      toast.error(
        `Ошибка сервера: ${error.response.status}. Попробуйте ещё раз.`
      );
    } else {
      toast.error("Произошла непредвиденная ошибка.");
    }
    return Promise.reject(error);
  }
);