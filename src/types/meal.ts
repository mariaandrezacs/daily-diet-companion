export interface Meal {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  isOnDiet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealFormData {
  name: string;
  description: string;
  dateTime: string;
  isOnDiet: boolean;
}

export interface DietStats {
  totalMeals: number;
  mealsOnDiet: number;
  mealsOffDiet: number;
  bestSequence: number;
  dietPercentage: number;
}
