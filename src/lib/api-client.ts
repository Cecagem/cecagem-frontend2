import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";

interface ApiError extends Error {
  status?: number;
}

type RequestData = Record<string, unknown> | FormData | string | null;

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        if (!error.response) return Promise.reject(error);

        if (error.response.status === 401) {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }

        const apiError: ApiError = new Error(
          (error.response.data as { message?: string })?.message ||
            error.message ||
            "Error desconocido"
        );

        apiError.status = error.response?.status;
        return Promise.reject(apiError);
      }
    );
  }

  // metodos basicos
  get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(endpoint, config);
  }

  post<T>(
    endpoint: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.post(endpoint, data, config);
  }

  put<T>(
    endpoint: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.put(endpoint, data, config);
  }

  patch<T>(
    endpoint: string,
    data?: RequestData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.client.patch(endpoint, data, config);
  }

  delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(endpoint, config);
  }

  uploadFile<T>(
    endpoint: string,
    file: File,
    extraData?: Record<string, string | number | boolean>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);
    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) =>
        formData.append(key, String(value))
      );
    }
    return this.post(endpoint, formData, config);
  }
}

export const cecagemApi = new ApiClient(
  process.env.NEXT_PUBLIC_API_CECAGEM_URL
);

export type { ApiError, RequestData };
