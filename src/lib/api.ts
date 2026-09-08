import { Meal, MealFormData } from '@/types/meal';

// Em desenvolvimento, sempre usa o proxy do Vite (/api -> VITE_API_URL) para evitar CORS.
// Em produção (build), chama VITE_API_URL diretamente — a API precisa liberar CORS.
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL ?? '');

interface ApiMeal {
  id: number;
  name: string;
  description: string;
  date_time: string;
  in_diet: boolean;
}

const toApiDateTime = (dateTime: string): string => {
  // "2025-03-03T08:00" -> "2025-03-03 08:00:00"
  const normalized = dateTime.replace('T', ' ');
  return normalized.length === 16 ? `${normalized}:00` : normalized;
};

const fromApiDateTime = (dateTime: string): string => {
  // "2025-03-03 08:00:00" -> ISO string
  return new Date(dateTime.replace(' ', 'T')).toISOString();
};

const mapApiMeal = (apiMeal: ApiMeal): Meal => ({
  id: String(apiMeal.id),
  name: apiMeal.name,
  description: apiMeal.description,
  dateTime: fromApiDateTime(apiMeal.date_time),
  isOnDiet: apiMeal.in_diet,
  createdAt: fromApiDateTime(apiMeal.date_time),
  updatedAt: fromApiDateTime(apiMeal.date_time),
});

const toApiPayload = (data: MealFormData) => ({
  name: data.name,
  description: data.description,
  date_time: toApiDateTime(data.dateTime),
  in_diet: data.isOnDiet,
});

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const mealsApi = {
  list: async (): Promise<Meal[]> => {
    const data = await request<{ refeicoes: ApiMeal[] }>('/refeicoes');
    return data.refeicoes.map(mapApiMeal);
  },

  get: async (id: string): Promise<Meal> => {
    const data = await request<ApiMeal | { refeicoes: ApiMeal }>(`/refeicoes/${id}`);
    const apiMeal = 'refeicoes' in data ? data.refeicoes : data;
    return mapApiMeal(apiMeal);
  },

  // A API retorna apenas {"message": "..."} (sem o objeto), então
  // create/update não retornam a refeição — o caller deve refazer o fetch.
  create: async (formData: MealFormData): Promise<void> => {
    await request<unknown>('/refeicoes', {
      method: 'POST',
      body: JSON.stringify(toApiPayload(formData)),
    });
  },

  update: async (id: string, formData: MealFormData): Promise<void> => {
    await request<unknown>(`/refeicoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toApiPayload(formData)),
    });
  },

  remove: async (id: string): Promise<void> => {
    await request<void>(`/refeicoes/${id}`, { method: 'DELETE' });
  },
};
