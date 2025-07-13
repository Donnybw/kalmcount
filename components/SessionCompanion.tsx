

import React, { useState, useEffect, FormEvent, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants, useAnimation, Transition } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { DateTime } from 'luxon';
import { SessionTab, ReflectionEntry, MantrasByCategory, ChatMessage, DailyActivities } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Card, Button } from './ui';
import type { BorderVariant } from './ui';
import { GUIDED_MEDITATIONS, MANTRAS_BY_CATEGORY, MANTRA_BACKGROUNDS, PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, BREATHING_METHODS, CheckIcon, XMarkIcon, InfoIcon, REFLECTION_PROMPTS, PaperAirplaneIcon, SparklesIcon, ChevronDownIcon, PencilSquareIcon, ChatBubbleBottomCenterTextIcon } from '../constants';
import TouchVisualizer from './TouchVisualizer';

const tabs = [SessionTab.Breathing, SessionTab.Meditation, SessionTab.Mantras, SessionTab.Reflections, SessionTab.Visualizer];

type LogActivityFn = (activity: keyof Omit<DailyActivities, 'date'>) => void;

const staggerList = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.07,
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
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: 20, scale: 0.95 },
};


const GuidedMeditation = ({ onLogActivity }: { onLogActivity: LogActivityFn }) => {
  const [currentVideo, setCurrentVideo] = useState(GUIDED_MEDITATIONS[0]);
  const [playerKey, setPlayerKey] = useState(currentVideo.id);

  useEffect(() => {
    setPlayerKey(currentVideo.id);
  }, [currentVideo]);

  return (
    <div>
      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-lg">
        <ReactPlayer
          key={playerKey}
          url={currentVideo.url}
          width="100%"
          height="100%"
          controls={true}
          playing={false}
          onPlay={() => onLogActivity('meditation')}
          loop={true}
          config={{
            playerVars: {
              showinfo: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
        />
      </div>
      <div className="flex justify-center gap-2 flex-wrap mt-4">
        {GUIDED_MEDITATIONS.map(video => (
          <Button variant="ghost" key={video.id} onClick={() => setCurrentVideo(video)} className={`text-sm ${currentVideo.id === video.id ? 'bg-calm-indigo-700' : ''}`}>
            {video.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

const BreathingVisualizer = ({ state, duration, isMoving }: { state: string, duration: number, isMoving: boolean }) => {
    const haloControls = useAnimation();

    useEffect(() => {
        if (isMoving) {
            haloControls.start({
                rotate: 360,
                transition: {
                    duration: 40,
                    ease: 'linear',
                    repeat: Infinity,
                }
            });
        } else {
            haloControls.stop();
        }
    }, [isMoving, haloControls]);

    const animationProps = {
        inhale:       { r: 95, d: "M -20,270 Q 100,150 220,270 V 270 H -20 Z", haloScale: 1.1, coreOpacity: 1 },
        exhale:       { r: 50, d: "M -20,270 Q 100,260 220,270 V 270 H -20 Z", haloScale: 1, coreOpacity: 0.7 },
        hold:         { r: 95, d: "M -20,270 Q 100,150 220,270 V 270 H -20 Z", haloScale: 1.1, coreOpacity: 1 },
        'hold-empty': { r: 50, d: "M -20,270 Q 100,260 220,270 V 270 H -20 Z", haloScale: 1, coreOpacity: 0.7 },
        initial:      { r: 50, d: "M -20,270 Q 100,260 220,270 V 270 H -20 Z", haloScale: 1, coreOpacity: 0.7 },
    };

    const transition: Transition = { duration, ease: 'easeInOut' };

    return (
        <motion.svg viewBox="-20 -10 240 280" className="w-full h-full">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c7d2fe" />
                    <stop offset="100%" stopColor="#818cf8" />
                </radialGradient>
                 <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.3)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
                </linearGradient>
            </defs>
            
             {/* Background Wave */}
            <motion.path
                fill="url(#wave-gradient)"
                animate={animationProps[state]}
                transition={transition}
            />
            
            {/* Particle Halo */}
            <motion.g animate={haloControls}>
                <motion.g animate={animationProps[state]} transition={transition}>
                    {[...Array(20)].map((_, i) => (
                        <circle 
                            key={i} 
                            cx={100 + 100 * Math.cos(i * 18 * Math.PI / 180)} 
                            cy={100 + 100 * Math.sin(i * 18 * Math.PI / 180)} 
                            r={i % 4 === 0 ? 2 : 1} 
                            fill="#a5b4fc"
                            opacity={0.5}
                        />
                    ))}
                </motion.g>
            </motion.g>

            {/* Core Circle */}
            <motion.circle
                cx="100"
                cy="100"
                fill="url(#core-gradient)"
                animate={animationProps[state]}
                transition={transition}
                style={{ filter: 'url(#glow)' }}
            />
        </motion.svg>
    );
};

const BreathingInfoModal = ({ method, onClose }: { method: typeof BREATHING_METHODS[0], onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
        onClick={onClose}
    >
        <Card
            className="w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Button 
                variant="ghost" 
                onClick={onClose} 
                className="absolute top-2 right-2 z-10 p-1 h-8 w-8"
                aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6 text-slate-400 hover:text-slate-300"/>
            </Button>

            <div className="p-6 space-y-4">
                <h3 className="font-nunito text-xl font-bold text-calm-blue-200">{method.name}</h3>
                <div>
                    <h4 className="font-nunito font-semibold text-calm-blue-300 mb-1">Purpose</h4>
                    <p className="text-sm text-slate-300">{method.purpose}</p>
                </div>
                 <div>
                    <h4 className="font-nunito font-semibold text-calm-blue-300 mb-1">Technique</h4>
                    <p className="text-sm text-slate-300 whitespace-pre-line">{method.technique}</p>
                </div>
            </div>
        </Card>
    </motion.div>
)

const GuidedBreathing = ({ onLogActivity }: { onLogActivity: LogActivityFn }) => {
    const [selectedMethodId, setSelectedMethodId] = useState(BREATHING_METHODS[0].id);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentText, setCurrentText] = useState('Tap to Start');
    const [currentStep, setCurrentStep] = useState({ state: 'initial', duration: 1 });
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const timerRef = useRef<number | null>(null);

    const selectedMethod = BREATHING_METHODS.find(m => m.id === selectedMethodId)!;

    useEffect(() => {
        if (isAnimating) {
            timerRef.current = window.setTimeout(() => {
                onLogActivity('breathing');
            }, 60000); // 60 seconds
        } else {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isAnimating, onLogActivity]);


    const toggleAnimation = () => {
        if (navigator.vibrate) {
            // A gentle tap for stop, a slightly more noticeable one for start
            navigator.vibrate(isAnimating ? 10 : 20);
        }
        setIsAnimating(prev => !prev);
    };

    useEffect(() => {
        let isCancelled = false;
        
        const runAnimationSequence = async () => {
            const sequence = selectedMethod.sequence;
            
            setCurrentText('Get Ready...');
            setCurrentStep({ state: 'initial', duration: 1.5 });
            await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));
            if (isCancelled) return;

            while (!isCancelled) {
                for (const step of sequence) {
                    if (isCancelled) return;
                    setCurrentText(step.text);
                    setCurrentStep(step);
                    await new Promise<void>(resolve => setTimeout(() => resolve(), step.duration * 1000));
                }
            }
        };

        if (isAnimating) {
            runAnimationSequence();
        } else {
            setCurrentText('Tap to Start');
            setCurrentStep({ state: 'initial', duration: 1 });
        }
        
        return () => { isCancelled = true; };
    }, [isAnimating, selectedMethod]);


    const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIsAnimating(false);
        setSelectedMethodId(e.target.value);
    };

    const isMoving = isAnimating && (currentStep.state === 'inhale' || currentStep.state === 'exhale');

    return (
        <div className="flex flex-col items-center justify-between gap-4" style={{ minHeight: '24rem' }}>
             <AnimatePresence>
                {isInfoModalOpen && <BreathingInfoModal method={selectedMethod} onClose={() => setIsInfoModalOpen(false)} />}
            </AnimatePresence>
            
            {/* Tip at the top */}
            <div className="h-10 flex flex-col items-center justify-center">
                 <AnimatePresence>
                    {selectedMethod.setupInstruction && !isAnimating && (
                        <motion.div
                            key={selectedMethod.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center text-sm text-slate-400"
                        >
                            <p>Tip: {selectedMethod.setupInstruction}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div 
                className="w-80 h-96 cursor-pointer relative"
                onClick={toggleAnimation}
            >
                <BreathingVisualizer state={currentStep.state} duration={currentStep.duration} isMoving={isMoving} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none -translate-y-10">
                    <div style={{ filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.9))' }}>
                        <p className="text-4xl font-bold text-center">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentText}
                                    className="bg-clip-text text-transparent inline-block"
                                    style={{
                                        backgroundImage: 'linear-gradient(45deg, #c7d2fe, #a5b4fc, #7dd3fc, #67e8f9)',
                                        backgroundSize: '200% auto',
                                        lineHeight: 1.2
                                    }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        backgroundPosition: ['0% center', '200% center'],
                                    }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ 
                                        opacity: { duration: 0.4, ease: 'easeOut' },
                                        y: { duration: 0.4, ease: 'easeOut' },
                                        backgroundPosition: {
                                            duration: 5,
                                            ease: 'linear',
                                            repeat: Infinity,
                                            repeatType: 'mirror'
                                        }
                                    }}
                                >
                                    {currentText}
                                </motion.span>
                            </AnimatePresence>
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls at the bottom */}
            <div className="w-full relative flex justify-center items-center" style={{ minHeight: '4rem' }}>
                 <div className="w-full max-w-xs flex justify-center">
                    <select 
                        id="breathing-method"
                        value={selectedMethodId} 
                        onChange={handleMethodChange} 
                        disabled={isAnimating}
                        className="font-nunito w-full bg-calm-indigo-950/50 p-2 rounded-lg border border-calm-blue-400 focus:ring-2 focus:ring-calm-blue-400 text-center transition-opacity disabled:opacity-50 appearance-none"
                    >
                        {BREATHING_METHODS.map(method => (
                            <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                    </select>
                </div>
                <div className="absolute bottom-2 right-0">
                    <Button variant="ghost" className="p-2" onClick={() => setIsInfoModalOpen(true)} aria-label="Show breathing technique info">
                        <InfoIcon className="h-6 w-6"/>
                    </Button>
                </div>
            </div>
        </div>
    );
};


const Mantras = ({ onLogActivity }: { onLogActivity: LogActivityFn }) => {
    const [mantrasByCategory, setMantrasByCategory] = useLocalStorage<MantrasByCategory>('mantrasByCategory', MANTRAS_BY_CATEGORY);
    const [selectedCategory, setSelectedCategory] = useLocalStorage('mantraCategory', Object.keys(MANTRAS_BY_CATEGORY)[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newMantra, setNewMantra] = useState('');
    
    const [isAutoplaying, setIsAutoplaying] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [isAddingMantra, setIsAddingMantra] = useState(false);
    
    const [viewedMantras, setViewedMantras] = useState(new Set());
    const activityLoggedRef = useRef(false);

    const addInputRef = useRef<HTMLInputElement>(null);
    const inactivityTimerRef = useRef<number | null>(null);

    const currentMantras = useMemo(() => mantrasByCategory[selectedCategory] || [], [mantrasByCategory, selectedCategory]);
    const bgImage = useMemo(() => MANTRA_BACKGROUNDS[currentIndex % MANTRA_BACKGROUNDS.length], [currentIndex, selectedCategory]);

    useEffect(() => {
        const rawData = window.localStorage.getItem('userMantras');
        if (rawData) {
            try {
                const oldMantras = JSON.parse(rawData);
                if (Array.isArray(oldMantras) && oldMantras.length > 0) {
                    setMantrasByCategory(prev => ({
                        ...prev,
                        "My Mantras": [...new Set([...(prev["My Mantras"] || []), ...oldMantras])]
                    }));
                    window.localStorage.removeItem('userMantras');
                }
            } catch (e) {
                console.error("Could not migrate old mantras", e);
                window.localStorage.removeItem('userMantras');
            }
        }
    }, [setMantrasByCategory]);
    
    useEffect(() => {
        setViewedMantras(new Set());
        activityLoggedRef.current = false;
    }, [selectedCategory]);

    useEffect(() => {
        if (currentMantras.length > 0) {
            setViewedMantras(prev => new Set(prev).add(currentIndex));
        }
    }, [currentIndex, currentMantras]);

    useEffect(() => {
        if (!activityLoggedRef.current && viewedMantras.size >= 5) {
            onLogActivity('mantras');
            activityLoggedRef.current = true;
        }
    }, [viewedMantras, onLogActivity]);

    const handleNext = useCallback(() => {
        if (currentMantras.length === 0) return;
        setCurrentIndex(prev => (prev + 1) % currentMantras.length);
    }, [currentMantras.length]);

    const handlePrev = useCallback(() => {
        if (currentMantras.length === 0) return;
        setCurrentIndex(prev => (prev - 1 + currentMantras.length) % currentMantras.length);
    }, [currentMantras.length]);

    const resumeAutoplay = useCallback(() => {
        setShowControls(false);
        setIsAddingMantra(false);
        if (currentMantras.length > 1) {
            setIsAutoplaying(true);
        }
    }, [currentMantras.length]);

    const handleInteraction = useCallback(() => {
        // Vibrate only when showing controls for the first time on interaction
        if (!showControls && navigator.vibrate) {
            navigator.vibrate(10);
        }
        if (isAutoplaying) {
            setIsAutoplaying(false);
        }
        setShowControls(true);

        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        inactivityTimerRef.current = window.setTimeout(resumeAutoplay, 5000);
    }, [isAutoplaying, resumeAutoplay, showControls]);

    useEffect(() => {
        if (!isAutoplaying || currentMantras.length <= 1) return;
        const autoplayTimer = setInterval(handleNext, 5000);
        return () => clearInterval(autoplayTimer);
    }, [isAutoplaying, currentMantras.length, handleNext]);

    useEffect(() => {
        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, []);

    const handleManualNav = (e: React.MouseEvent, direction: 'next' | 'prev') => {
        e.stopPropagation();
        handleInteraction();
        if (direction === 'next') handleNext();
        else handlePrev();
    };

    const handleAddMantraSubmit = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleInteraction();
        if (newMantra.trim()) {
            const categoryToAddTo = "My Mantras";
            const newMantrasForCategory = [...(mantrasByCategory[categoryToAddTo] || []), newMantra.trim()];
            setMantrasByCategory(prev => ({
                ...prev,
                [categoryToAddTo]: newMantrasForCategory
            }));
            setNewMantra('');
            if (selectedCategory !== categoryToAddTo) {
                setSelectedCategory(categoryToAddTo);
            }
            setCurrentIndex(newMantrasForCategory.length - 1);
            setIsAddingMantra(false);
        }
    };
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleInteraction();
        if (selectedCategory !== "My Mantras" || currentMantras.length === 0) return;
        const updatedMantras = currentMantras.filter((_, i) => i !== currentIndex);
        setMantrasByCategory(prev => ({ ...prev, [selectedCategory]: updatedMantras }));
        if (currentIndex >= updatedMantras.length) {
            setCurrentIndex(Math.max(0, updatedMantras.length - 1));
        }
    };
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        handleInteraction();
        setSelectedCategory(e.target.value);
        setCurrentIndex(0);
    }
    
    useEffect(() => {
        if (isAddingMantra && addInputRef.current) {
            addInputRef.current.focus();
        }
    }, [isAddingMantra]);

    const animationVariants: Variants[] = [
        { 
            visible: { opacity: 1, transition: { delay: 0.3, staggerChildren: 0.04 } },
            hidden: { opacity: 0 }
        },
        {
            visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
            hidden: { opacity: 0, scale: 0.9 }
        },
        {
            visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'circOut' } },
            hidden: { opacity: 0, filter: 'blur(10px)' }
        }
    ];
    const letterVariant: Variants = {
        visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 200 } },
        hidden: { opacity: 0, y: 20 }
    };
    const currentAnimationIndex = currentIndex % animationVariants.length;
    const currentAnimationVariant = animationVariants[currentAnimationIndex];
    const isStaggeredAnimation = currentAnimationIndex === 0;
    const mantraText = currentMantras[currentIndex] || "Tap to begin your session.";

    return (
        <div className="flex flex-col justify-between" style={{ minHeight: '28rem' }}>
            <div 
                className="relative text-center flex-grow flex items-center justify-center rounded-2xl overflow-hidden shadow-inner bg-calm-indigo-950 cursor-pointer"
                onClick={handleInteraction}
            >
                <AnimatePresence>
                    <motion.div
                        key={bgImage}
                        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                        style={{ backgroundImage: `url(${bgImage})` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                </AnimatePresence>
                <div 
                    className="absolute inset-0 animate-trippy-gradient"
                    style={{
                        background: `linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(56, 189, 248, 0.1), rgba(244, 114, 182, 0.2), rgba(99, 102, 241, 0.2))`,
                        backgroundSize: '400% 400%',
                    }}
                />
                <div className="absolute inset-0 bg-black/30"></div>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={`${selectedCategory}-${currentIndex}-${mantraText}`}
                        variants={currentAnimationVariant}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="relative z-10 text-3xl lg:text-4xl font-nunito italic text-white px-10 drop-shadow-xl"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                        {isStaggeredAnimation ? (
                            <>
                            "
                            {mantraText.split('').map((char, index) => (
                                <motion.span key={index} variants={letterVariant}>{char}</motion.span>
                            ))}
                            "
                            </>
                        ) : (
                            `"${mantraText}"`
                        )}
                    </motion.p>
                </AnimatePresence>

                 {/* Navigation Click Areas */}
                <div className="absolute left-0 top-0 h-full w-1/2 z-20" onClick={(e) => handleManualNav(e, 'prev')} aria-label="Previous Mantra"/>
                <div className="absolute right-0 top-0 h-full w-1/2 z-20" onClick={(e) => handleManualNav(e, 'next')} aria-label="Next Mantra"/>
                
                <AnimatePresence>
                {showControls && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="absolute top-4 left-4 z-30"
                            onClick={(e) => e.stopPropagation()}
                        >
                             <select 
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="w-44 bg-black/40 text-white p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-calm-blue-400 appearance-none text-center text-sm backdrop-blur-sm"
                             >
                                {Object.keys(mantrasByCategory).map(cat => (
                                   <option key={cat} value={cat}>{cat} ({mantrasByCategory[cat].length})</option>
                                ))}
                            </select>
                        </motion.div>
                        
                        <motion.div
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 10 }}
                             transition={{ duration: 0.3 }}
                             className="absolute bottom-4 right-4 z-30"
                             onClick={(e) => e.stopPropagation()}
                        >
                            <AnimatePresence mode="wait">
                            {isAddingMantra ? (
                                <motion.form 
                                    key="add-form"
                                    initial={{ width: 40, opacity: 0 }}
                                    animate={{ width: 280, opacity: 1 }}
                                    exit={{ width: 40, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    onSubmit={handleAddMantraSubmit} className="flex gap-2 items-center bg-black/40 p-1.5 rounded-full border border-white/20 backdrop-blur-sm"
                                >
                                    <input ref={addInputRef} type="text" value={newMantra} onChange={e => setNewMantra(e.target.value)} placeholder="Add a new mantra" className="flex-grow bg-transparent text-white px-3 focus:outline-none placeholder-slate-400 text-sm" />
                                    <Button type="submit" variant="ghost" className="p-1.5 h-7 w-7 rounded-full bg-green-500/80 hover:bg-green-500 text-white flex-shrink-0" aria-label="Save Mantra"><CheckIcon className="h-4 w-4"/></Button>
                                    <Button type="button" onClick={() => { handleInteraction(); setIsAddingMantra(false); }} variant="ghost" className="p-1.5 h-7 w-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex-shrink-0" aria-label="Cancel"><XMarkIcon className="h-4 w-4"/></Button>
                                </motion.form>
                            ) : (
                                <motion.div 
                                    key="action-buttons"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, transition: { delay: 0.2 } }}
                                    exit={{ opacity: 0 }}
                                    className="flex gap-2"
                                >
                                    <Button variant="ghost" onClick={() => { handleInteraction(); setIsAddingMantra(true); }} className="p-2 h-10 w-10 rounded-full bg-black/40 hover:bg-calm-blue-500/50 text-white backdrop-blur-sm" aria-label="Add Mantra"><PlusIcon className="h-5 w-5"/></Button>
                                    <Button 
                                        variant="ghost"
                                        onClick={handleDelete} 
                                        disabled={selectedCategory !== "My Mantras" || currentMantras.length === 0}
                                        className="p-2 h-10 w-10 rounded-full bg-black/40 hover:bg-red-500/50 text-white backdrop-blur-sm disabled:hover:bg-black/40 disabled:opacity-50"
                                        aria-label="Delete Mantra"
                                    >
                                        <TrashIcon className="h-5 w-5"/>
                                    </Button>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div 
                            initial={{opacity: 0}} animate={{opacity: 0.5}} exit={{opacity: 0}}
                            transition={{ duration: 0.3 }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-white"
                        >
                            <ChevronLeftIcon className="h-10 w-10 drop-shadow-lg" />
                        </motion.div>
                        <motion.div 
                             initial={{opacity: 0}} animate={{opacity: 0.5}} exit={{opacity: 0}}
                             transition={{ duration: 0.3 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-white"
                        >
                            <ChevronRightIcon className="h-10 w-10 drop-shadow-lg" />
                        </motion.div>
                    </>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SimpleMarkdown = ({ text, truncate }: { text: string; truncate?: boolean }) => {
    const content = truncate ? text.split('\n\n')[0] + (text.includes('\n\n') ? '...' : '') : text;
    const parts = content.split(/(\*\*.*?\*\*)/g);

    return (
        <p className="flex-grow text-slate-200 whitespace-pre-wrap break-words font-nunito">
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-calm-blue-300 font-bold">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </p>
    );
};

const Reflections = ({ onLogActivity }: { onLogActivity: LogActivityFn }) => {
    const [entries, setEntries] = useLocalStorage<ReflectionEntry[]>('reflectionEntries', []);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [entryToDelete, setEntryToDelete] = useState<ReflectionEntry | 'all' | null>(null);

    const [isChatActive, setIsChatActive] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [currentUserInput, setCurrentUserInput] = useState('');
    const [entryToContinue, setEntryToContinue] = useState<ReflectionEntry | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    useEffect(() => {
        if (isChatActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isChatActive, currentPromptIndex]);

    const startChat = (entry?: ReflectionEntry) => {
        if (entry && entry.chatHistory) {
            setEntryToContinue(entry);
            setChatHistory(entry.chatHistory);
            setCurrentPromptIndex(REFLECTION_PROMPTS.length); // We are past the guided prompts
        } else {
            setEntryToContinue(null);
            setChatHistory([{ sender: 'guide' as const, text: REFLECTION_PROMPTS[0] }]);
            setCurrentPromptIndex(0);
        }
        setIsChatActive(true);
        setCurrentUserInput('');
    };
    
    const resetChat = () => {
        setIsChatActive(false);
        setChatHistory([]);
        setCurrentPromptIndex(0);
        setCurrentUserInput('');
        setEntryToContinue(null);
    };

    const handleSaveReflection = () => {
        const finalHistory = currentUserInput.trim() !== ''
            ? [...chatHistory, { sender: 'user' as const, text: currentUserInput.trim() }]
            : chatHistory;

        if (entryToContinue) {
            const userMessagesSinceContinue = finalHistory.slice(entryToContinue.chatHistory?.length || 0)
                .filter(m => m.sender === 'user')
                .map(m => m.text);
            
            if (userMessagesSinceContinue.length === 0) {
                resetChat();
                return;
            }

            const appendedText = `\n\n**Added on ${DateTime.now().toFormat('MMM d, h:mm a')}**\n` + userMessagesSinceContinue.join('\n');
            
            setEntries(prev => prev.map(e => e.id === entryToContinue.id
                ? { ...e, text: e.text + appendedText, chatHistory: finalHistory, timestamp: new Date().toISOString() }
                : e
            ));

        } else { // Creating a new entry
            const userAnswers = finalHistory
                .filter(msg => msg.sender === 'user')
                .map(msg => msg.text);

            if (userAnswers.length === 0) {
                resetChat();
                return;
            }

            const promptAnswers = userAnswers.slice(0, REFLECTION_PROMPTS.length);
            const finalThoughts = userAnswers.slice(REFLECTION_PROMPTS.length);

            const formattedParts = promptAnswers.map((answer, i) => `**${REFLECTION_PROMPTS[i]}**\n${answer}`);
            
            if (finalThoughts.length > 0) {
                formattedParts.push(`**Final Thoughts**\n${finalThoughts.join('\n')}`);
            }
            
            const formattedText = formattedParts.join('\n\n');

            const newEntry: ReflectionEntry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                text: formattedText,
                chatHistory: finalHistory,
            };
            setEntries(prev => [newEntry, ...prev].slice(0, 50));
            onLogActivity('reflections');
        }
        resetChat();
    };


    const handleChatSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (currentUserInput.trim() === '') return;

        const newHistory: ChatMessage[] = [...chatHistory, { sender: 'user' as const, text: currentUserInput.trim() }];
        const nextPromptIndex = currentPromptIndex + 1;

        if (nextPromptIndex < REFLECTION_PROMPTS.length) {
            newHistory.push({ sender: 'guide' as const, text: REFLECTION_PROMPTS[nextPromptIndex] });
            setCurrentPromptIndex(nextPromptIndex);
        } else {
            setCurrentPromptIndex(nextPromptIndex);
        }
        setChatHistory(newHistory);
        setCurrentUserInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (isLastPrompt || entryToContinue) {
                handleSaveReflection();
            } else {
                handleChatSubmit(e as any);
            }
        }
    };

    const handleStartEdit = (entry: ReflectionEntry) => {
        setEditingId(entry.id);
        setEditText(entry.text);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleSaveEdit = () => {
        if (editingId === null || editText.trim() === '') return;
        setEntries(entries.map(entry =>
            entry.id === editingId ? { ...entry, text: editText.trim(), timestamp: new Date().toISOString() } : entry
        ));
        handleCancelEdit();
    };

    const handleDeleteRequest = (entryOrAll: ReflectionEntry | 'all') => {
        setEntryToDelete(entryOrAll);
    };

    const handleConfirmDelete = () => {
        if (!entryToDelete) return;
        if (entryToDelete === 'all') {
            setEntries([]);
        } else {
            setEntries(prev => prev.filter(e => e.id !== entryToDelete.id));
        }
        if (entryToDelete !== 'all' && editingId === entryToDelete.id) {
             handleCancelEdit();
        }
        setEntryToDelete(null);
    };

    const handleCancelDelete = () => setEntryToDelete(null);

    const getConfirmationText = () => {
        if (!entryToDelete) return { title: '', message: '' };
        if (entryToDelete === 'all') return { title: 'Clear All Reflections?', message: `Are you sure you want to delete all ${entries.length} reflections? This action cannot be undone.` };
        return { title: 'Delete Reflection?', message: 'Are you sure you want to delete this reflection? This action cannot be undone.' };
    };

    const isLastPrompt = currentPromptIndex >= REFLECTION_PROMPTS.length;

    return (
        <div className="flex flex-col gap-4" style={{minHeight: '28rem'}}>
            <AnimatePresence mode="wait">
                {isChatActive ? (
                    <motion.div
                        key="chat-active"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="flex flex-col"
                    >
                        <div ref={chatContainerRef} className="flex-grow space-y-3 p-2 h-64 overflow-y-auto rounded-lg bg-calm-indigo-950/30 shadow-inner">
                             {chatHistory.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    layout
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                    className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'guide' && <div className="h-8 w-8 rounded-full bg-calm-blue-500 flex-shrink-0 flex items-center justify-center"><SparklesIcon className="h-5 w-5 text-white"/></div>}
                                    <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-calm-indigo-600 text-white rounded-br-lg' : 'bg-calm-indigo-900 text-slate-200 rounded-bl-lg'}`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <form onSubmit={handleChatSubmit} className="flex gap-2 mt-4 items-start">
                             <textarea
                                ref={inputRef}
                                value={currentUserInput}
                                onChange={e => setCurrentUserInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={entryToContinue ? "Add more notes..." : (isLastPrompt ? "Add final thoughts or save..." : "Type your response...")}
                                rows={2}
                                className="w-full flex-grow bg-calm-indigo-950/50 p-3 rounded-lg border border-calm-blue-400 focus:ring-2 focus:ring-calm-blue-400 resize-y placeholder-slate-400 font-nunito"
                            />
                            <Button type="submit" variant="primary" onClick={isLastPrompt || entryToContinue ? handleSaveReflection : undefined} disabled={!entryToContinue && !isLastPrompt && currentUserInput.trim() === ''}>
                                {isLastPrompt || entryToContinue ? 'Save' : <PaperAirplaneIcon className="h-5 w-5" />}
                            </Button>
                        </form>
                         <Button variant="ghost" className="text-xs text-slate-400 mt-1" onClick={resetChat}>Cancel</Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat-inactive"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center bg-calm-indigo-950/30 p-6 rounded-lg shadow-inner"
                    >
                        <h4 className="text-lg font-nunito font-bold text-calm-blue-200">Guided Reflection</h4>
                        <p className="text-slate-400 mt-2 mb-4 text-sm max-w-sm mx-auto">Turn your thoughts into insights. Let our guide ask a few gentle questions to help you explore your day.</p>
                        <Button onClick={() => startChat()}>
                           Begin Reflection
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

             <div className="flex justify-between items-center mt-2 px-2">
                <p className="text-xs text-slate-500">Your last 50 reflections are saved.</p>
                <Button 
                    variant="ghost"
                    onClick={() => handleDeleteRequest('all')} 
                    disabled={entries.length === 0}
                    className="text-xs p-1.5 h-auto text-red-500/70 hover:text-red-500 hover:bg-red-500/10 disabled:hover:bg-transparent disabled:opacity-50"
                >
                    <TrashIcon className="h-3.5 w-3.5 mr-1.5"/>
                    Clear All
                </Button>
            </div>
            
            <motion.div 
                className="flex-grow bg-calm-indigo-950/30 rounded-lg p-2 space-y-2 overflow-y-auto shadow-inner"
                style={{maxHeight: '20rem'}}
                initial="hidden"
                animate="visible"
                variants={staggerList}
            >
                {entries.length === 0 && !isChatActive ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-full text-slate-400 font-nunito italic p-8"
                    >
                        Your saved reflections will appear here.
                    </motion.div>
                ) : (
                    <AnimatePresence>
                    {entries.map(entry => {
                        const isExpanded = expandedId === entry.id;
                        const isEditingThis = editingId === entry.id;
                        return (
                        <motion.div
                            key={entry.id}
                            layout
                            variants={staggerItem}
                            exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                            className="bg-calm-indigo-950/60 p-3 rounded-lg shadow-md transition-colors duration-300 border-l-4 border-cyan-400"
                        >
                            <div 
                                className="flex justify-between items-start gap-4 cursor-pointer"
                                onClick={() => !isEditingThis && setExpandedId(isExpanded ? null : entry.id)}
                            >
                               <SimpleMarkdown text={entry.text} truncate={!isExpanded} />
                               <div className="flex-shrink-0 flex flex-col items-end pl-2">
                                    <span className="font-nunito text-xs text-slate-500">{DateTime.fromISO(entry.timestamp).toFormat(isExpanded ? 'MMM d, h:mm a' : 'MMM d')}</span>
                                    <ChevronDownIcon className={`h-5 w-5 text-slate-400 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                               </div>
                            </div>
                            <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    {isEditingThis ? (
                                        <div className="space-y-3">
                                            <textarea
                                                value={editText}
                                                onChange={e => setEditText(e.target.value)}
                                                className="w-full bg-calm-indigo-900/50 p-2 rounded-lg border border-calm-blue-400 focus:ring-2 focus:ring-calm-blue-400 resize-y font-nunito"
                                                rows={8}
                                                autoFocus
                                            />
                                            <div className="flex justify-end items-center gap-2">
                                                <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                                                <Button onClick={handleSaveEdit} disabled={editText.trim() === ''}>Save</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pt-4 mt-4 border-t border-white/10 flex justify-end items-center gap-2">
                                             <Button variant="ghost" onClick={() => startChat(entry)} className="text-sm px-3 py-1.5 h-auto">
                                                <ChatBubbleBottomCenterTextIcon className="h-4 w-4 mr-2"/> Add Notes
                                            </Button>
                                             <Button variant="ghost" onClick={() => handleStartEdit(entry)} className="text-sm px-3 py-1.5 h-auto">
                                                <PencilSquareIcon className="h-4 w-4 mr-2"/> Edit
                                            </Button>
                                             <Button variant="ghost" onClick={() => handleDeleteRequest(entry)} className="text-sm px-3 py-1.5 h-auto text-red-500/80 hover:text-red-500 hover:bg-red-500/10">
                                                <TrashIcon className="h-4 w-4 mr-2"/> Delete
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                    )})}
                    </AnimatePresence>
                )}
            </motion.div>
           
            <AnimatePresence>
                {entryToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center"
                        onClick={handleCancelDelete}
                    >
                        <Card 
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-sm"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <div className="p-6 text-center space-y-4">
                                <h3 className="text-xl font-bold font-nunito text-calm-blue-200">{getConfirmationText().title}</h3>
                                <p className="text-sm text-slate-300">{getConfirmationText().message}</p>
                                <div className="flex justify-center gap-4 pt-2">
                                    <Button variant="ghost" onClick={handleCancelDelete} className="w-24">
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleConfirmDelete} 
                                        className="w-24 bg-red-500 hover:bg-red-600 focus:ring-red-400 shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const tabContent = (onLogActivity: LogActivityFn) => ({
  [SessionTab.Meditation]: <GuidedMeditation onLogActivity={onLogActivity} />,
  [SessionTab.Breathing]: <GuidedBreathing onLogActivity={onLogActivity} />,
  [SessionTab.Mantras]: <Mantras onLogActivity={onLogActivity} />,
  [SessionTab.Reflections]: <Reflections onLogActivity={onLogActivity} />,
  [SessionTab.Visualizer]: <TouchVisualizer />,
});

interface SessionCompanionProps {
  borderVariant?: BorderVariant;
  onLogActivity: LogActivityFn;
}

export default function SessionCompanion({ borderVariant, onLogActivity }: SessionCompanionProps) {
  const [activeTab, setActiveTab] = useState<SessionTab>(SessionTab.Breathing);
  const content = useMemo(() => tabContent(onLogActivity), [onLogActivity]);
  const [showTip, setShowTip] = useLocalStorage('showKalmScoreTip', true);

  return (
    <Card borderVariant={borderVariant}>
       <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-calm-indigo-800/50 border border-calm-blue-500/30 shadow-md">
                <InfoIcon className="h-6 w-6 text-calm-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300 flex-grow">
                  <strong>Pro-Tip:</strong> Engaging with these tools daily boosts your Kalm Score!
                </p>
                <Button
                  variant="ghost"
                  className="p-1 h-7 w-7 rounded-full -mr-1 -mt-1 text-slate-400 hover:text-white"
                  onClick={() => setShowTip(false)}
                  aria-label="Dismiss tip"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-2">
        <div className="flex flex-wrap justify-center gap-1 bg-calm-indigo-800/30 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => {
                if (navigator.vibrate) {
                  navigator.vibrate(10);
                }
                setActiveTab(tab);
              }}
              className={`${activeTab === tab ? '' : 'hover:bg-white/5'} flex-grow relative rounded-md px-3 py-1.5 text-sm font-medium text-calm-blue-200 transition focus-visible:outline-2`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 z-10 bg-gradient-to-r from-calm-indigo-600 to-calm-blue-500 rounded-lg shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20 text-center">{tab}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {content[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}