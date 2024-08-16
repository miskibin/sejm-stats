"use client"
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = () => {
  const [showPatronite, setShowPatronite] = useState(true);
  const [showUpdate, setShowUpdate] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const patroniteTimer = setTimeout(() => setShowPatronite(false), 10000);
    const updateTimer = setTimeout(() => setShowUpdate(false), 15000);

    return () => {
      clearTimeout(patroniteTimer);
      clearTimeout(updateTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      <AnimatePresence>
        {showPatronite && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Alert className="w-80 bg-red-100 dark:bg-red-900 shadow-lg border border-red-300 dark:border-red-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                  <AlertTitle className="font-semibold text-red-700 dark:text-red-300">Wesprzyj projekt</AlertTitle>
                </div>
                <button onClick={() => setShowPatronite(false)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <AlertDescription className="mt-2">
                <a
                  href="https://patronite.pl/sejm-stats"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100 underline"
                >
                  Wesprzyj nas na Patronite
                </a>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpdate && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Alert className="w-80 bg-blue-100 dark:bg-blue-900 shadow-lg border border-blue-300 dark:border-blue-700">
              <div className="flex justify-between items-start">
                <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Ostatnia aktualizacja</AlertTitle>
                <button onClick={() => setShowUpdate(false)} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <AlertDescription className="mt-2 text-blue-600 dark:text-blue-300">
                {today} 00:00
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;