import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Meal, MealFormData } from '@/types/meal';

const mealSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
  dateTime: z.string().min(1, 'Data e hora são obrigatórios'),
  isOnDiet: z.boolean(),
});

interface MealFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MealFormData) => void;
  meal?: Meal | null;
}

export const MealFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  meal,
}: MealFormDialogProps) => {
  const form = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      description: '',
      dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      isOnDiet: true,
    },
  });

  useEffect(() => {
    if (meal) {
      form.reset({
        name: meal.name,
        description: meal.description,
        dateTime: format(new Date(meal.dateTime), "yyyy-MM-dd'T'HH:mm"),
        isOnDiet: meal.isOnDiet,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        dateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        isOnDiet: true,
      });
    }
  }, [meal, form, open]);

  const handleSubmit = (data: MealFormData) => {
    onSubmit(data);
    onOpenChange(false);
    form.reset();
  };

  const isOnDiet = form.watch('isOnDiet');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {meal ? 'Editar refeição' : 'Nova refeição'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Salada de frutas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Maçã, banana, manga e uva"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOnDiet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Está dentro da dieta?</FormLabel>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={isOnDiet ? 'default' : 'outline'}
                      className={`flex-1 ${isOnDiet ? 'bg-success hover:bg-success/90' : ''}`}
                      onClick={() => field.onChange(true)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Sim
                    </Button>
                    <Button
                      type="button"
                      variant={!isOnDiet ? 'destructive' : 'outline'}
                      className="flex-1"
                      onClick={() => field.onChange(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Não
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {meal ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
