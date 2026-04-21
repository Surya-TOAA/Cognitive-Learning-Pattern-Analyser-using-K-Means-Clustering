"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export const LayoutTextFlip = ({
    text = "Learn smarter. ",
    words = ["faster.", "bigger.", "stronger.", "better."],
    duration = 3000,
    className = ""
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, duration);

        return () => clearInterval(interval);
    }, [words.length, duration]);

    return (
        <div className={cn("inline-flex flex-wrap items-center gap-x-3", className)}>
            <motion.span
                layoutId="subtext"
                className="whitespace-nowrap"
            >
                {text}
            </motion.span>

            <motion.span
                layout
                className="relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-border bg-surface px-4 py-1 text-accent-blue shadow-premium-dark min-w-[2.5em]"
            >
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={currentIndex}
                        initial={{ y: -40, opacity: 0, filter: "blur(10px)" }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.32, 0.72, 0, 1]
                        }}
                        className="inline-block whitespace-nowrap"
                    >
                        {words[currentIndex]}
                    </motion.span>
                </AnimatePresence>
            </motion.span>
        </div>
    );
};
