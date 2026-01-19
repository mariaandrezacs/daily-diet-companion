import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { MealCard } from '@/components/MealCard';
import { MealFormDialog } from '@/components/MealFormDialog';
import { MealDetailDialog } from '@/components/MealDetailDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useMeals } from '@/hooks/useMeals';
import { Meal, MealFormData } from '@/types/meal';

const Index = () => {
  const { meals, stats, addMeal, updateMeal, deleteMeal } = useMeals();
  
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);

  const handleAddMeal = () => {
    setSelectedMeal(null);
    setFormOpen(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setFormOpen(true);
  };

  const handleViewMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setDetailOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setMealToDelete(id);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (mealToDelete) {
      deleteMeal(mealToDelete);
      toast.success('Refeição excluída com sucesso!');
      setMealToDelete(null);
    }
  };

  const handleSubmit = (data: MealFormData) => {
    if (selectedMeal) {
      updateMeal(selectedMeal.id, data);
      toast.success('Refeição atualizada com sucesso!');
    } else {
      addMeal(data);
      toast.success('Refeição cadastrada com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <StatsCard stats={stats} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Refeições</h2>
            <Button onClick={handleAddMeal} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova refeição
            </Button>
          </div>

          {meals.length === 0 ? (
            <EmptyState onAddMeal={handleAddMeal} />
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {meals.map((meal, index) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    index={index}
                    onEdit={handleEditMeal}
                    onDelete={handleDeleteRequest}
                    onView={handleViewMeal}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </main>

      <MealFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        meal={selectedMeal}
      />

      <MealDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        meal={selectedMeal}
        onEdit={handleEditMeal}
        onDelete={handleDeleteRequest}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Index;
