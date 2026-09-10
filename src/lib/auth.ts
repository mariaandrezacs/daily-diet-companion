const TOKEN_KEY = 'daily-diet-token';

export const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL ?? '');

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
};

interface LoginResponse {
  access_token: string;
}

interface AuthError {
  error?: string;
}

const parseError = async (response: Response): Promise<string> => {
  const data = await response.json().catch(() => ({} as AuthError));
  return data.error ?? `Erro ${response.status}`;
};

export const authApi = {
  register: async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }
  },

  login: async (username: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const data = (await response.json()) as LoginResponse;
    if (!data.access_token) {
      throw new Error('Token de acesso não encontrado na resposta');
    }

    authStorage.setToken(data.access_token);
  },

  logout: () => {
    authStorage.clearToken();
  },
};
