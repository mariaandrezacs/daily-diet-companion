import { motion } from 'framer-motion';
import { LogOut, Salad } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-2xl items-center px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Salad className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Daily Diet</h1>
            <p className="text-xs text-muted-foreground">Controle sua alimentação</p>
          </div>
        </div>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={logout}
            aria-label="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </motion.header>
  );
};
