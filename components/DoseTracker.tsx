

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DateTime } from 'luxon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Button } from './ui';
import type { BorderVariant } from './ui';
import { PencilIcon, MOOD_OPTIONS, SYMPTOM_TAGS, XMarkIcon, ChartBarIcon, ChevronLeftIcon, ChevronRightIcon, INTENTION_SUGGESTIONS, SparklesIcon, FireIcon } from '../constants';
import { MoodLog } from '../types';

interface DoseTrackerProps {
  onTrackShipment: () => void;
  borderVariant?: BorderVariant;
  moodHistory: MoodLog[];
  setMoodHistory: React.Dispatch<React.SetStateAction<MoodLog[]>>;
  kalmScore: { score: number; streak: number };
}

interface ConfettiPieceProps {
    x: number;
    y: number;
    angle: number;
    color: string;
}

const ConfettiPiece = ({ x, y, angle, color }: ConfettiPieceProps) => (
    <motion.div
        style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 10,
            height: 10,
            backgroundColor: color,
            x,
            y,
            transformStyle: 'preserve-3d',
        }}
        animate={{
            x: x + Math.cos(angle) * 300,
            y: y + Math.sin(angle) * 300,
            opacity: [1, 0],
            scale: [1, 0.5],
            rotateX: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            rotateY: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
        }}
        transition={{ duration: 2, ease: 'easeOut' }}
    />
);


interface WeeklySummary {
    weekKey: string;
    startDate: DateTime;
    endDate: DateTime;
    logs: MoodLog[];
    avgMood: number;
    tagCounts: { [tag: string]: number };
}

const staggerList = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};

const staggerItem = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 20 },
};

const WeeklyMoodChart = ({ weekData }: { weekData: WeeklySummary }) => {
    const width = 350;
    const height = 180;
    const padding = { top: 20, right: 10, bottom: 30, left: 40 };

    const logsByDay = Array(7).fill(null);
    weekData.logs.forEach(log => {
        const dayIndex = DateTime.fromISO(log.date).weekday - 1; // 0=Mon, 6=Sun
        logsByDay[dayIndex] = log;
    });

    const points = logsByDay
        .map((log, i) => {
            if (!log) return null;
            const x = padding.left + i * (width - padding.left - padding.right) / 6;
            const y = padding.top + (5 - log.mood) * (height - padding.top - padding.bottom) / 4;
            return { x, y, mood: log.mood, date: log.date };
        })
        .filter((p): p is { x: number; y: number; mood: number, date: string } => p !== null);

    const pathD = points.length > 0 ? "M" + points.map(p => `${p.x} ${p.y}`).join(" L") : "";
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
            {/* Y-axis labels with emojis */}
            {MOOD_OPTIONS.map(mood => (
                <text key={mood.value} x={padding.left - 15} y={padding.top + (5 - mood.value) * (height - padding.top - padding.bottom) / 4 + 5} className="text-lg" textAnchor="middle">{mood.emoji}</text>
            ))}
            {/* X-axis labels */}
            {weekDays.map((day, i) => (
                 <text key={day} x={padding.left + i * (width - padding.left - padding.right) / 6} y={height - 5} className="text-[10px] fill-slate-400" textAnchor="middle">{day}</text>
            ))}
            {/* Chart line */}
            <motion.path
                d={pathD}
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
             {/* Gradient for the line */}
            <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
            </defs>
            {/* Data points */}
            {points.map((p, i) => (
                <motion.circle
                    key={p.date}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#fff"
                    stroke="#6366f1"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                    <title>{`${DateTime.fromISO(p.date).toFormat('MMM d')}: ${MOOD_OPTIONS.find(m => m.value === p.mood)?.label}`}</title>
                </motion.circle>
            ))}
        </svg>
    );
};

const TagFrequencyChart = ({ tagCounts }: { tagCounts: { [tag: string]: number } }) => {
    const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
    if (sortedTags.length === 0) {
        return <p className="text-sm text-slate-400 text-center py-4">No tags were logged this week.</p>;
    }
    const maxCount = sortedTags.length > 0 ? sortedTags[0][1] : 0;
    
    return (
        <motion.div className="space-y-2" initial="hidden" animate="visible" variants={staggerList}>
            {sortedTags.map(([tag, count]) => (
                <motion.div key={tag} className="grid grid-cols-4 items-center gap-2" variants={staggerItem}>
                    <span className="col-span-1 text-sm text-slate-300 truncate">{tag}</span>
                    <div className="col-span-3 flex items-center gap-2">
                        <div className="flex-grow bg-calm-indigo-950 rounded-full h-4">
                             <motion.div
                                className="bg-gradient-to-r from-calm-blue-400 to-calm-indigo-500 rounded-full h-4"
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / maxCount) * 100}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                             />
                        </div>
                        <span className="font-semibold text-sm w-4 text-right text-calm-blue-200">{count}</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

const MoodHistoryModal = ({ history, onClose }: { history: MoodLog[], onClose: () => void }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    const weeklySummaries: WeeklySummary[] = useMemo(() => {
        if (history.length === 0) return [];
        
        const groupedByWeek = history.reduce((acc, log) => {
            const date = DateTime.fromISO(log.date);
            const weekKey = `${date.year}-W${date.weekNumber}`;
            if (!acc[weekKey]) {
                acc[weekKey] = [];
            }
            acc[weekKey].push(log);
            return acc;
        }, {} as { [key: string]: MoodLog[] });

        return Object.entries(groupedByWeek)
            .map(([weekKey, logs]) => {
                const firstLogDate = DateTime.fromISO(logs[0].date);
                const startDate = firstLogDate.startOf('week');
                const endDate = firstLogDate.endOf('week');
                const totalMood = logs.reduce((sum, log) => sum + log.mood, 0);
                const avgMood = totalMood / logs.length;
                const tagCounts = logs.reduce((acc, log) => {
                    log.tags.forEach(tag => {
                        acc[tag] = (acc[tag] || 0) + 1;
                    });
                    return acc;
                }, {} as { [tag: string]: number });
                
                return { weekKey, startDate, endDate, logs: logs.sort((a,b) => DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()), avgMood, tagCounts };
            })
            .sort((a, b) => a.startDate.toMillis() - b.startDate.toMillis());
            
    }, [history]);

    const currentWeekIndex = weeklySummaries.length > 0 ? weeklySummaries.length - 1 + weekOffset : -1;
    const currentWeekData = weeklySummaries[currentWeekIndex];

    const canGoForward = weekOffset < 0;
    const canGoBack = currentWeekIndex > 0;

    const getWeekTitle = (data: WeeklySummary) => {
      const start = data.startDate.toFormat('MMM d');
      const end = data.endDate.toFormat('MMM d, yyyy');
      return `${start} - ${end}`;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 grid place-items-center overflow-y-auto"
            onClick={onClose}
        >
            <Card
                className="relative w-full max-w-2xl !shadow-2xl my-auto"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <div className="flex justify-center items-center p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => setWeekOffset(p => p - 1)} disabled={!canGoBack} className="p-1 h-8 w-8"><ChevronLeftIcon className="h-5 w-5"/></Button>
                         <h3 className="font-nunito text-base sm:text-lg font-bold text-calm-blue-200 text-center w-48 sm:w-64">
                            {currentWeekData ? getWeekTitle(currentWeekData) : "Check-in History"}
                        </h3>
                        <Button variant="ghost" onClick={() => setWeekOffset(p => p + 1)} disabled={!canGoForward} className="p-1 h-8 w-8"><ChevronRightIcon className="h-5 w-5"/></Button>
                    </div>
                     <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        className="absolute top-3 right-3 z-10 px-1 py-1 h-8 w-8 text-slate-400 hover:text-slate-300"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-6 w-6"/>
                    </Button>
                </div>
                <div className="p-4 md:p-6">
                    {currentWeekData ? (
                        <div className="space-y-8">
                            <div>
                                <h4 className="font-nunito font-bold text-lg text-calm-blue-300 mb-2">Weekly Mood</h4>
                                <WeeklyMoodChart weekData={currentWeekData} />
                            </div>
                             <div>
                                <h4 className="font-nunito font-bold text-lg text-calm-blue-300 mb-3">Weekly Intentions</h4>
                                <motion.ul className="space-y-3" initial="hidden" animate="visible" variants={staggerList}>
                                  {currentWeekData.logs.map(log => (
                                    <motion.li key={log.date} variants={staggerItem} className="text-sm p-3 bg-calm-indigo-950/50 rounded-lg flex items-start gap-4 border-l-2 border-calm-blue-400/50">
                                      <span className="font-bold text-calm-blue-300 w-10">{DateTime.fromISO(log.date).toFormat('EEE')}</span>
                                      <p className="flex-1 text-slate-300 font-nunito italic">
                                        "{log.intention || <span className="text-slate-500">No intention set.</span>}"
                                      </p>
                                    </motion.li>
                                  ))}
                                </motion.ul>
                            </div>
                            <div>
                                <h4 className="font-nunito font-bold text-lg text-calm-blue-300 mb-3">Tag Frequency</h4>
                                <TagFrequencyChart tagCounts={currentWeekData.tagCounts} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-slate-400">No check-ins have been recorded yet.</p>
                             <p className="text-sm text-slate-500 mt-2">Log your mood daily to see your progress here!</p>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

const KalmScoreDisplay = ({ score, streak }: { score: number; streak: number }) => {
    const scoreColor = score > 75 ? 'text-cyan-400' : score > 50 ? 'text-calm-blue-300' : score > 25 ? 'text-amber-400' : 'text-red-400';
    const scoreGradientId = score > 75 ? 'scoreGradientCyan' : score > 50 ? 'scoreGradientBlue' : score > 25 ? 'scoreGradientAmber' : 'scoreGradientRed';
    const scoreGradientColors = {
        scoreGradientCyan: { from: '#22d3ee', to: '#67e8f9' },
        scoreGradientBlue: { from: '#3b82f6', to: '#60a5fa' },
        scoreGradientAmber: { from: '#f59e0b', to: '#facc15' },
        scoreGradientRed: { from: '#ef4444', to: '#f87171' },
    };

    const encouragement = 
        score > 85 ? "You're thriving! Keep up the amazing work." :
        score > 70 ? "Incredible consistency and insight. You're on a great path." :
        score > 50 ? "You're building wonderful momentum. Keep going!" :
        score > 25 ? "Every step counts. You're showing up for yourself." :
        "A new journey begins with a single step. You've got this.";

    return (
        <motion.div
            key="kalm-score"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center p-4 relative"
        >
            <h3 className="text-xl font-bold font-nunito text-calm-blue-200 mb-4">Your Kalm Score</h3>
            <div className="relative w-48 h-48 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id={scoreGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={scoreGradientColors[scoreGradientId].from} />
                            <stop offset="100%" stopColor={scoreGradientColors[scoreGradientId].to} />
                        </linearGradient>
                    </defs>
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="10"
                        className="stroke-calm-indigo-800/50"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        strokeWidth="10"
                        stroke={`url(#${scoreGradientId})`}
                        fill="transparent"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: score / 100 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`text-6xl font-bold ${scoreColor}`}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={score}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.4 }}
                            >
                                {score}
                            </motion.span>
                        </AnimatePresence>
                    </motion.span>
                </div>
            </div>
            {streak > 0 && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 font-semibold px-3 py-1 rounded-full text-sm mb-4"
                >
                    <FireIcon className="h-4 w-4 text-amber-500" />
                    {streak}-day streak
                </motion.div>
            )}
            <p className="text-sm font-nunito italic text-slate-400 h-10 flex items-center justify-center px-4">{encouragement}</p>
        </motion.div>
    );
};


const MoodTracker = ({ moodHistory, setMoodHistory, kalmScore }: { moodHistory: MoodLog[], setMoodHistory: React.Dispatch<React.SetStateAction<MoodLog[]>>, kalmScore: { score: number; streak: number } }) => {
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const todayISO = DateTime.now().toISODate();
    
    const todaysLog = moodHistory.find(log => log.date === todayISO);

    const [isCheckinOpen, setIsCheckinOpen] = useState(!todaysLog);
    const [selectedMood, setSelectedMood] = useState<number | null>(todaysLog?.mood ?? null);
    const [selectedTags, setSelectedTags] = useState<string[]>(todaysLog?.tags ?? []);
    const [intention, setIntention] = useState<string>(todaysLog?.intention ?? '');
    
    useEffect(() => {
        const currentLog = moodHistory.find(log => log.date === todayISO);
        if (currentLog) {
            setSelectedMood(currentLog.mood);
            setSelectedTags(currentLog.tags);
            setIntention(currentLog.intention);
            setIsCheckinOpen(false);
        } else {
            setSelectedMood(null);
            setSelectedTags([]);
            setIntention('');
            setIsCheckinOpen(true);
        }
    }, [todayISO, moodHistory]);

    const handleMoodSelect = (moodValue: number) => {
        setSelectedMood(prev => prev === moodValue ? null : moodValue);
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSaveCheckin = () => {
        if (selectedMood === null || intention.trim() === '') return;

        setMoodHistory(prev => {
            const otherDays = prev.filter(log => log.date !== todayISO);
            return [...otherDays, { date: todayISO, mood: selectedMood, tags: selectedTags, intention: intention.trim() }];
        });
        setIsCheckinOpen(false);
    };

    const handleSuggestIntention = () => {
        let newIntention = intention;
        if (INTENTION_SUGGESTIONS.length > 1) {
            while (newIntention === intention) {
                newIntention = INTENTION_SUGGESTIONS[Math.floor(Math.random() * INTENTION_SUGGESTIONS.length)];
            }
        } else {
            newIntention = INTENTION_SUGGESTIONS[0] || '';
        }
        setIntention(newIntention);
    };
    
    const selectedMoodLabel = MOOD_OPTIONS.find(m => m.value === selectedMood)?.label;

    return (
        <>
            <div className="mt-6">
                <div className="h-px bg-gradient-to-r from-transparent via-calm-indigo-700 to-transparent mb-6"></div>
                <AnimatePresence initial={false} mode="wait">
                    {isCheckinOpen ? (
                         <motion.div
                            key="checkin-form"
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{
                                open: { opacity: 1, height: 'auto' },
                                collapsed: { opacity: 0, height: 0 }
                            }}
                            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden space-y-6"
                        >
                            <h3 className="text-xl font-bold font-nunito text-calm-blue-200 mb-1 text-center">Today's Check-in</h3>
                            <div>
                                <div className="flex justify-around items-center mb-2">
                                    {MOOD_OPTIONS.map(({ value, emoji }) => (
                                        <motion.button
                                            key={value}
                                            onClick={() => handleMoodSelect(value)}
                                            className="text-4xl transition-transform duration-200 ease-in-out"
                                            animate={{ scale: selectedMood === value ? 1.4 : 1, filter: selectedMood !== null && selectedMood !== value ? 'saturate(0.5) brightness(0.8)' : 'saturate(1) brightness(1)' }}
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </div>
                                <AnimatePresence>
                                {selectedMoodLabel &&
                                    <motion.p 
                                        initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                        className="text-center text-sm font-medium text-calm-blue-300 h-5"
                                    >
                                        {selectedMoodLabel}
                                    </motion.p>
                                }
                                </AnimatePresence>
                            </div>
                             <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-md font-semibold text-calm-blue-300 font-nunito">Today's Intention</h4>
                                    <Button
                                        variant="ghost"
                                        onClick={handleSuggestIntention}
                                        className="p-1.5 h-auto text-calm-blue-300/70 hover:text-calm-blue-100 hover:bg-calm-indigo-800/50 rounded-full"
                                        title="Suggest an intention"
                                        aria-label="Suggest an intention"
                                    >
                                        <SparklesIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                                <textarea
                                  id="intention"
                                  rows={2}
                                  value={intention}
                                  onChange={(e) => setIntention(e.target.value)}
                                  placeholder="e.g., 'To be present and kind to myself'"
                                  className="w-full bg-calm-indigo-950/50 p-3 text-sm rounded-lg border border-calm-blue-400 focus:ring-2 focus:ring-calm-blue-400 transition duration-200 shadow-inner resize-none placeholder-slate-400"
                                />
                             </div>
                            
                            <div className="flex flex-wrap justify-center gap-2">
                                {SYMPTOM_TAGS.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <Button
                                            key={tag}
                                            variant={isSelected ? 'primary' : 'ghost'}
                                            onClick={() => handleTagToggle(tag)}
                                            className="text-sm px-3 py-1"
                                        >
                                            {tag}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button onClick={handleSaveCheckin} disabled={selectedMood === null || intention.trim() === ''} className="w-full">
                                Save Check-in
                            </Button>
                        </motion.div>
                    ) : (
                        <KalmScoreDisplay
                            score={kalmScore.score}
                            streak={kalmScore.streak}
                        />
                    )}
                </AnimatePresence>

                <div className="text-center mt-4 flex flex-col items-center gap-1">
                    <Button variant="ghost" onClick={() => setIsHistoryVisible(true)} disabled={moodHistory.length === 0}>
                        <ChartBarIcon className="h-5 w-5 mr-2"/>
                        View Check-in History
                    </Button>
                     {!isCheckinOpen && (
                        <Button variant="ghost" onClick={() => setIsCheckinOpen(true)} className="text-sm text-slate-400 hover:text-slate-200">
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            Edit Today's Check-in
                        </Button>
                    )}
                </div>
            </div>

             <AnimatePresence>
                {isHistoryVisible && <MoodHistoryModal history={moodHistory} onClose={() => setIsHistoryVisible(false)} />}
            </AnimatePresence>
        </>
    );
};

const getProgressStyle = (count: number) => {
    if (count > 10) {
        return {
            gradientId: 'progressGradientBlue',
            from: '#38bdf8', // calm-blue-400
            to: '#6366f1', // calm-indigo-500
            text: 'text-white'
        };
    }
    if (count > 5) {
        return {
            gradientId: 'progressGradientYellow',
            from: '#facc15', // yellow-400
            to: '#f59e0b', // amber-500
            text: 'text-yellow-300'
        };
    }
    return {
        gradientId: 'progressGradientRed',
        from: '#ef4444', // red-500
        to: '#f43f5e', // rose-600
        text: 'text-red-400'
    };
};

export default function DoseTracker({ onTrackShipment, borderVariant, moodHistory, setMoodHistory, kalmScore }: DoseTrackerProps) {
  const [trocheCount, setTrocheCount] = useLocalStorage('trocheCount', 30);
  const [lastUpdate, setLastUpdate] = useLocalStorage('lastDoseUpdate', DateTime.now().toISODate());
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCount, setEditedCount] = useState(String(trocheCount));

  useEffect(() => {
    const today = DateTime.now().toISODate();
    if (today && lastUpdate && today > lastUpdate) {
      const lastDate = DateTime.fromISO(lastUpdate);
      const todayDate = DateTime.fromISO(today);
      const daysPassed = Math.floor(todayDate.diff(lastDate, 'days').days);
      
      if (daysPassed > 0) {
        setTrocheCount(prev => Math.max(0, prev - daysPassed));
        setLastUpdate(today);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    setEditedCount(String(trocheCount));
  }, [trocheCount]);

  const handleAddShipment = () => {
    setTrocheCount(prev => prev + 30);
    setShowConfetti(true);
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val) && val.length <= 3) {
      setEditedCount(val);
    }
  };

  const saveCount = () => {
    const newCount = parseInt(editedCount, 10);
    if (!isNaN(newCount)) {
      setTrocheCount(Math.max(0, newCount));
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveCount();
    } else if (e.key === 'Escape') {
      setEditedCount(String(trocheCount));
      setIsEditing(false);
    }
  };

  const progress = trocheCount / 30;
  const progressStyle = getProgressStyle(trocheCount);

  return (
    <Card className="p-6 text-center relative overflow-hidden" borderVariant={borderVariant}>
      <AnimatePresence>
        {showConfetti &&
          [...Array(50)].map((_, i) => (
            <ConfettiPiece
              key={i}
              x={0}
              y={0}
              angle={(i / 50) * Math.PI * 2}
              color={['#6366f1', '#818cf8', '#38bdf8', '#7dd3fc'][i % 4]}
            />
          ))}
      </AnimatePresence>
      <h2 className="text-2xl font-bold font-nunito tracking-wide bg-gradient-to-r from-calm-blue-200 to-calm-blue-300 bg-clip-text text-transparent mb-4">
        Daily Dose Tracker
      </h2>
      <div className="relative w-48 h-48 mx-auto mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
                 <linearGradient id={progressStyle.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={progressStyle.from} />
                    <stop offset="100%" stopColor={progressStyle.to} />
                </linearGradient>
            </defs>
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="10"
            className="stroke-calm-indigo-800/50"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="10"
            stroke={`url(#${progressStyle.gradientId})`}
            fill="transparent"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isEditing ? (
                 <motion.div initial={{opacity:0, scale: 0.9}} animate={{opacity:1, scale: 1}}>
                    <input
                        type="number"
                        value={editedCount}
                        onChange={handleCountChange}
                        onBlur={saveCount}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-28 text-center bg-transparent text-6xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-calm-blue-400 rounded-lg"
                    />
                </motion.div>
            ) : (
                <div className="relative group" onClick={() => setIsEditing(true)}>
                    <motion.span
                        key={trocheCount}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-6xl font-bold ${progressStyle.text} cursor-pointer p-2 transition-colors duration-500`}
                    >
                        {trocheCount}
                    </motion.span>
                    <PencilIcon className="absolute -right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
            )}
            <span className="text-sm text-slate-400 mt-1">doses left</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={handleAddShipment}>
          Got a new 30-day supply
        </Button>
        <Button onClick={onTrackShipment} variant="ghost">
          Track Next Shipment
        </Button>
      </div>
      <MoodTracker moodHistory={moodHistory} setMoodHistory={setMoodHistory} kalmScore={kalmScore} />
    </Card>
  );
}