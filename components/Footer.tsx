
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateTime } from 'luxon';
import { Button } from './ui';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { InfoIcon, XMarkIcon } from '../constants';

export default function Footer() {
  const [lastDismissed, setLastDismissed] = useLocalStorage<string | null>('backupReminderDismissed', null);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const oneWeekAgo = DateTime.now().minus({ weeks: 1 });
    const dismissedDate = lastDismissed ? DateTime.fromISO(lastDismissed) : null;

    if (!dismissedDate || dismissedDate < oneWeekAgo) {
      setShowReminder(true);
    }
  }, [lastDismissed]);

  const handleDismissReminder = () => {
    setShowReminder(false);
    setLastDismissed(DateTime.now().toISODate());
  };

  const handleBackup = () => {
    const backupData: { [key: string]: string } = {};
    const keysToBackup = [
        'trocheCount',
        'lastDoseUpdate',
        'isShipmentVisible',
        'shipmentTracking',
        'mantrasByCategory',
        'mantraCategory',
        'reflectionEntries',
        'moodHistory',
        'dailyActivityLogs',
        'showKalmScoreTip',
        'backupReminderDismissed'
    ];

    keysToBackup.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
            backupData[key] = value;
        }
    });

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const date = new Date().toISOString().split('T')[0];
    link.download = `calmcount_backup_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonString = event.target?.result as string;
                if (!jsonString) {
                    throw new Error("File could not be read.");
                }

                const restoredData = JSON.parse(jsonString);
                
                if (typeof restoredData !== 'object' || restoredData === null || Array.isArray(restoredData)) {
                    throw new Error('Invalid backup file format.');
                }

                Object.keys(restoredData).forEach(key => {
                    if (typeof restoredData[key] === 'string') {
                         localStorage.setItem(key, restoredData[key]);
                    }
                });

                alert('Data restored successfully! The application will now reload to apply the changes.');
                window.location.reload();

            } catch (error) {
                console.error("Failed to restore data:", error);
                alert(`Failed to restore data. The file may be corrupt or not a valid CalmCount backup.\n\nError: ${(error as Error).message}`);
            }
        };
        reader.readAsText(file);
    };
    input.click();
  };


  return (
    <footer className="w-full text-center py-8 px-4 mt-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
            {showReminder && (
                <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 20, height: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="mb-8 overflow-hidden"
                >
                    <div className="p-4 rounded-lg bg-calm-indigo-800/50 border border-calm-blue-500/30 shadow-lg text-left">
                        <div className="flex items-start gap-4">
                            <InfoIcon className="h-6 w-6 text-calm-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-grow">
                                <h5 className="font-bold text-calm-blue-300">Friendly Reminder</h5>
                                <p className="text-sm text-slate-300 mt-1">
                                    Your data is stored locally on this device. To prevent loss if your browser's cache is cleared, please back it up regularly.
                                </p>
                            </div>
                             <Button
                                variant="ghost"
                                className="p-1 h-7 w-7 rounded-full -mr-1 -mt-1 text-slate-400 hover:text-white flex-shrink-0"
                                onClick={handleDismissReminder}
                                aria-label="Dismiss reminder"
                             >
                                <XMarkIcon className="h-5 w-5" />
                             </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="h-px bg-gradient-to-r from-transparent via-calm-indigo-700 to-transparent mb-6"></div>
        
        <div className="mb-6">
            <h4 className="font-nunito text-lg font-semibold text-slate-300 mb-4">Data Management</h4>
            <div className="flex flex-col items-center gap-3">
                <Button variant="ghost" onClick={handleBackup}>Backup Data</Button>
                <Button variant="ghost" onClick={handleRestore}>Restore Data</Button>
            </div>
            <p className="text-xs text-slate-500 mt-4 max-w-md mx-auto">
                Your data is stored only in this browser. Backup your data to a file to prevent loss or to transfer to another device.
            </p>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-calm-indigo-700 to-transparent mb-6"></div>

        <div className="space-y-3 text-xs text-slate-400">
          <p className="font-nunito text-base font-semibold text-slate-300">
            KalmCount is currently in beta.
          </p>
          <p>
            This application is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="pt-2 text-sm text-slate-500">
            Made with <span className="text-red-400">♡</span>
          </p>
        </div>
      </div>
    </footer>
  );
}