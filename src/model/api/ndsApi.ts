import axios from "axios";

const API_BASE_URL = "http://195.133.39.82:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const getToken = async () => {
  try {
    const response = await apiClient.get("/token", {
      headers: {
        accept: "*/*",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Не удалось получить токен. Пожалуйста, попробуйте позже.");
  }
};

export const getNdsData = async () => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await apiClient.get("/api/Nds", {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addNdsData = async (data: any) => {
  try {
    const response = await apiClient.post("/api/Nds", data, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchNdsById = async (id: string) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await apiClient.get(`/api/Nds/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Unauthorized: Неверный токен.");
      }

      if (error.response.status === 404) {
        throw new Error("Не найдено: Товар с таким ID не существует.");
      }
      throw new Error(
        `Ошибка: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      throw new Error("Ошибка сети или сервер недоступен.");
    }
  }
};

export const updateNdsById = async (
  id: string,
  values: {
    name: string;
    description: string;
    value: number;
    deletedAt: string;
  }
) => {
  try {
    const response = await apiClient.put(`/api/Nds/${id}`, values);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("Не найдено: Товар с таким ID не существует.");
      }
      throw new Error(
        `Ошибка: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      throw new Error("Ошибка сети или сервер недоступен.");
    }
  }
};

export const deleteNdsById = async (id: string) => {
  const response = await apiClient.delete(`/api/nds/${id}`);
  return response.data;
};

export const softDeleteNdsById = async (id: string) => {
  const response = await apiClient.put(
    `/api/nds/${id}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const restoreNdsById = async (id: string) => {
  const response = await apiClient.put(
    `/api/nds/${id}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getItemById = async (id: string) => {
  const response = await apiClient.get(`/api/nds/${id}`);
  return response.data;
};
