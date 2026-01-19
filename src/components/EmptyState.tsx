import { motion } from 'framer-motion';
import { Salad, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddMeal: () => void;
}

export const EmptyState = ({ onAddMeal }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Salad className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">
        Nenhuma refeição cadastrada
      </h3>
      <p className="mb-6 max-w-sm text-muted-foreground">
        Comece a controlar sua dieta adicionando sua primeira refeição do dia.
      </p>
      <Button onClick={onAddMeal} size="lg">
        <Plus className="mr-2 h-5 w-5" />
        Adicionar refeição
      </Button>
    </motion.div>
  );
};
