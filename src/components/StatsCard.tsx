import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Utensils, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DietStats } from '@/types/meal';

interface StatsCardProps {
  stats: DietStats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const statItems = [
    {
      label: 'Total de refeições',
      value: stats.totalMeals,
      icon: Utensils,
      color: 'text-foreground',
      bgColor: 'bg-secondary',
    },
    {
      label: 'Na dieta',
      value: stats.mealsOnDiet,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Fora da dieta',
      value: stats.mealsOffDiet,
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Melhor sequência',
      value: stats.bestSequence,
      icon: Trophy,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/90 to-primary shadow-lg">
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <motion.p
              key={stats.dietPercentage}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-primary-foreground"
            >
              {stats.dietPercentage.toFixed(1)}%
            </motion.p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              das refeições dentro da dieta
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {statItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="rounded-xl bg-card/95 p-3 shadow-sm"
              >
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
