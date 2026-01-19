import { useState, useCallback, useMemo } from 'react';
import { Meal, MealFormData, DietStats } from '@/types/meal';

const STORAGE_KEY = 'daily-diet-meals';

const loadMeals = (): Meal[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMeals = (meals: Meal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
};

export const useMeals = () => {
  const [meals, setMeals] = useState<Meal[]>(loadMeals);

  const addMeal = useCallback((data: MealFormData) => {
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setMeals((prev) => {
      const updated = [newMeal, ...prev];
      saveMeals(updated);
      return updated;
    });
    
    return newMeal;
  }, []);

  const updateMeal = useCallback((id: string, data: MealFormData) => {
    setMeals((prev) => {
      const updated = prev.map((meal) =>
        meal.id === id
          ? { ...meal, ...data, updatedAt: new Date().toISOString() }
          : meal
      );
      saveMeals(updated);
      return updated;
    });
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setMeals((prev) => {
      const updated = prev.filter((meal) => meal.id !== id);
      saveMeals(updated);
      return updated;
    });
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
    addMeal,
    updateMeal,
    deleteMeal,
    getMeal,
  };
};
