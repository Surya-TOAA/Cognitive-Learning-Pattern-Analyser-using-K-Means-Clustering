import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const AnimatedThemeToggler = ({ className }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "group relative h-9 w-9 rounded-xl border border-black/5 bg-white/50 backdrop-blur-sm transition-all hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                className
            )}
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className="flex items-center justify-center"
                    >
                        <Sun className="h-5 w-5 text-amber-500 fill-amber-500/10 group-hover:scale-110 transition-transform" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className="flex items-center justify-center"
                    >
                        <Moon className="h-5 w-5 text-accent-blue fill-accent-blue/10 group-hover:scale-110 transition-transform" />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-0 rounded-xl bg-accent-blue/0 group-hover:bg-accent-blue/5 transition-colors" />
        </button>
    );
};
