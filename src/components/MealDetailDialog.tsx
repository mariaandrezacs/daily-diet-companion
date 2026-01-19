import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X, Calendar, Clock, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Meal } from '@/types/meal';

interface MealDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: Meal | null;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export const MealDetailDialog = ({
  open,
  onOpenChange,
  meal,
  onEdit,
  onDelete,
}: MealDetailDialogProps) => {
  if (!meal) return null;

  const formattedDate = format(new Date(meal.dateTime), "EEEE, dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  const formattedTime = format(new Date(meal.dateTime), 'HH:mm');

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(meal);
  };

  const handleDelete = () => {
    onDelete(meal.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="pr-8 text-xl">{meal.name}</DialogTitle>
            <Badge
              variant={meal.isOnDiet ? 'default' : 'destructive'}
              className="shrink-0"
            >
              {meal.isOnDiet ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Na dieta
                </>
              ) : (
                <>
                  <X className="mr-1 h-3 w-3" />
                  Fora da dieta
                </>
              )}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">{meal.description}</p>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium capitalize text-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{formattedTime}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
