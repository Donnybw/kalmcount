

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateTime } from 'luxon';
import DoseTracker from './components/DoseTracker';
import SessionCompanion from './components/SessionCompanion';
import ShipmentTracker from './components/ShipmentTracker';
import { useLocalStorage } from './hooks/useLocalStorage';
import Footer from './components/Footer';
import { MoodLog, DailyActivities } from './types';

const AnimatedTitle = ({ children }: { children: React.ReactNode }) => (
    <motion.span
        className="inline-block bg-clip-text text-transparent"
        style={{
            backgroundImage: 'linear-gradient(90deg, #a5b4fc, #7dd3fc, #f472b6, #a5b4fc)',
            backgroundSize: '200% 200%',
        }}
        animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
            duration: 5,
            ease: 'linear',
            repeat: Infinity,
        }}
    >
        {children}
    </motion.span>
);

export default function App() {
  const [isShipmentVisible, setIsShipmentVisible] = useLocalStorage('isShipmentVisible', false);
  const [moodHistory, setMoodHistory] = useLocalStorage<MoodLog[]>('moodHistory', []);
  const [dailyActivityLogs, setDailyActivityLogs] = useLocalStorage<DailyActivities[]>('dailyActivityLogs', []);
  
  const [kalmScore, setKalmScore] = useState({ score: 0, streak: 0 });
  const todayISO = DateTime.now().toISODate();
  const shipmentContainerRef = useRef<HTMLDivElement>(null);

  const calculateKalmScore = useCallback((history: MoodLog[], activities: DailyActivities | undefined): { score: number; streak: number } => {
    if (history.length === 0) return { score: 0, streak: 0 };
    
    const sortedHistory = [...history].sort((a, b) => DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis());

    // 1. Calculate Consistency Streak (Max 50 points)
    let streak = 0;
    const today = DateTime.now().startOf('day');
    
    if (sortedHistory.length > 0) {
        const mostRecentLogDate = DateTime.fromISO(sortedHistory[0].date).startOf('day');
        const diffInDays = today.diff(mostRecentLogDate, 'days').days;
        
        if (diffInDays <= 1) { // Logged today or yesterday
            streak = 1;
            let currentDay = mostRecentLogDate;
            for (let i = 1; i < sortedHistory.length; i++) {
                const nextExpectedDay = currentDay.minus({ days: 1 });
                const nextLogDate = DateTime.fromISO(sortedHistory[i].date).startOf('day');
                
                if (nextLogDate.hasSame(nextExpectedDay, 'day')) {
                    streak++;
                    currentDay = nextLogDate;
                } else {
                    break; 
                }
            }
        }
    }
    const streakScore = Math.min(streak, 10) * 5;

    // 2. Calculate Mood Momentum (Max 40 points)
    const sevenDaysAgo = DateTime.now().minus({ days: 7 }).startOf('day');
    const recentLogs = sortedHistory.filter(log => DateTime.fromISO(log.date).startOf('day') >= sevenDaysAgo);

    let moodScore = 0;
    if (recentLogs.length > 0) {
        let totalWeightedMood = 0;
        let totalWeight = 0;

        recentLogs.forEach(log => {
            const logDate = DateTime.fromISO(log.date).startOf('day');
            const daysAgo = Math.floor(DateTime.now().startOf('day').diff(logDate, 'days').days);
            const weight = Math.max(1, 8 - daysAgo); // Heavier weight for recent days
            totalWeightedMood += log.mood * weight;
            totalWeight += weight;
        });
        
        const weightedAvgMood = totalWeight > 0 ? totalWeightedMood / totalWeight : 0;
        moodScore = weightedAvgMood * 8; // Scale to 40 (5 * 8 = 40)
    }

    // 3. Calculate Activity Score (Max 10 points)
    let activityScore = 0;
    if (activities) {
        const activityCount = (activities.meditation ? 1 : 0) + (activities.breathing ? 1 : 0) + (activities.mantras ? 1 : 0) + (activities.reflections ? 1 : 0);
        activityScore = activityCount * 2.5; // 2.5 points per activity, max 10
    }

    const finalScore = Math.round(streakScore + moodScore + activityScore);
    return { score: Math.min(100, finalScore), streak };
  }, []);

  useEffect(() => {
    const todaysActivities = dailyActivityLogs.find(a => a.date === todayISO);
    setKalmScore(calculateKalmScore(moodHistory, todaysActivities));
  }, [moodHistory, dailyActivityLogs, todayISO, calculateKalmScore]);

  useEffect(() => {
    if (isShipmentVisible) {
      setTimeout(() => {
        shipmentContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); // A small delay ensures the element is rendered and animation starts.
    }
  }, [isShipmentVisible]);


  const logActivity = useCallback((activity: keyof Omit<DailyActivities, 'date'>) => {
    setDailyActivityLogs(prevLogs => {
        const todayLogIndex = prevLogs.findIndex(log => log.date === todayISO);
        
        if (todayLogIndex > -1) {
            const existingLog = prevLogs[todayLogIndex];
            if (existingLog[activity]) {
                return prevLogs; // Already logged, no change
            }
            const updatedLogs = [...prevLogs];
            updatedLogs[todayLogIndex] = { ...existingLog, [activity]: true };
            return updatedLogs;
        } else {
            const newLog: DailyActivities = {
                date: todayISO,
                meditation: false,
                breathing: false,
                mantras: false,
                reflections: false,
                [activity]: true,
            };
            return [...prevLogs, newLog];
        }
    });
  }, [todayISO, setDailyActivityLogs]);

  return (
    <main className={`relative min-h-screen w-full font-sans text-slate-200 transition-colors duration-500 ${"bg-[linear-gradient(120deg,_#0c4a6e_0%,_#1e1b4b_50%,_#082f49_100%)] bg-[length:200%_200%] animate-aurora-bg"}`}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
             <h1 className="text-6xl md:text-7xl font-bold pb-2 drop-shadow-lg">
                <span className="font-pacifico font-normal text-7xl md:text-8xl"><AnimatedTitle>KalmCount</AnimatedTitle></span>
            </h1>
            <p className="text-xl text-slate-300 mt-4 font-nunito italic">
                Your companion for mindful healing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <DoseTracker 
                onTrackShipment={() => setIsShipmentVisible(!isShipmentVisible)} 
                borderVariant="electric"
                moodHistory={moodHistory}
                setMoodHistory={setMoodHistory}
                kalmScore={kalmScore}
              />
              <AnimatePresence>
                {isShipmentVisible && (
                  <motion.div
                    ref={shipmentContainerRef}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  >
                    <ShipmentTracker borderVariant="cyan" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="lg:col-span-3">
              <SessionCompanion borderVariant="indigo" onLogActivity={logActivity} />
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}