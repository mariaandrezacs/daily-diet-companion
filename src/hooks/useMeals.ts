import { useState, useCallback, useMemo, useEffect } from 'react';
import { Meal, MealFormData, DietStats } from '@/types/meal';
import { mealsApi } from '@/lib/api';

export const useMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mealsApi.list();
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar refeições');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const addMeal = useCallback(async (data: MealFormData) => {
    await mealsApi.create(data);
    await fetchMeals();
  }, [fetchMeals]);

  const updateMeal = useCallback(async (id: string, data: MealFormData) => {
    await mealsApi.update(id, data);
    await fetchMeals();
  }, [fetchMeals]);

  const deleteMeal = useCallback(async (id: string) => {
    await mealsApi.remove(id);
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  }, []);

  const getMeal = useCallback((id: string) => {
    return meals.find((meal) => meal.id === id);
  }, [meals]);

  const stats: DietStats = useMemo(() => {
    const totalMeals = meals.length;
    const mealsOnDiet = meals.filter((m) => m.isOnDiet).length;
    const mealsOffDiet = totalMeals - mealsOnDiet;
    const dietPercentage = totalMeals > 0 ? (mealsOnDiet / totalMeals) * 100 : 0;

    // Calculate best sequence of meals on diet
    let bestSequence = 0;
    let currentSequence = 0;
    
    const sortedMeals = [...meals].sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
    
    for (const meal of sortedMeals) {
      if (meal.isOnDiet) {
        currentSequence++;
        bestSequence = Math.max(bestSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
    }

    return {
      totalMeals,
      mealsOnDiet,
      mealsOffDiet,
      bestSequence,
      dietPercentage,
    };
  }, [meals]);

  const sortedMeals = useMemo(() => {
    return [...meals].sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
  }, [meals]);

  return {
    meals: sortedMeals,
    stats,
    isLoading,
    error,
    refetch: fetchMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    getMeal,
  };
};
