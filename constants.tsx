
import React from 'react';
import { MantrasByCategory } from './types';

export const GUIDED_MEDITATIONS = [
  { id: 'positive-energy', title: 'Positive Energy', url: 'https://www.youtube.com/watch?v=Ei0QHQbOOFU' },
  { id: 'self-love', title: 'Self Love', url: 'https://www.youtube.com/watch?v=4hzWUwLEUks' },
  { id: 'let-go', title: 'Let Go', url: 'https://www.youtube.com/watch?v=2DXqMBXmP8Q' },
];

export const MANTRAS_BY_CATEGORY: MantrasByCategory = {
    "For Calm": [
        "I am calm and at peace.",
        "I breathe in relaxation, I breathe out tension.",
        "This moment is peaceful and serene.",
        "My mind is quiet.",
        "My breath is my anchor to the present moment.",
        "I release all that no longer serves me.",
        "I am safe and sound."
    ],
    "For Growth": [
        "I am healing and growing stronger every day.",
        "I embrace change and the opportunities it brings.",
        "I am evolving into the best version of myself.",
        "Every experience is a chance to learn.",
        "I am open to new possibilities.",
        "Mistakes are proof that I am trying.",
        "I am capable of amazing things."
    ],
    "For Self-Love": [
        "I am worthy of love and happiness.",
        "I accept myself completely.",
        "I am enough, just as I am.",
        "I treat myself with kindness and compassion.",
        "I honor my needs and feelings.",
        "I am my own best friend.",
        "I celebrate my unique and wonderful journey."
    ],
    "For Gratitude": [
        "I am grateful for this moment.",
        "I appreciate the good in my life.",
        "My heart is filled with gratitude.",
        "I find joy in the simple things.",
        "Gratitude turns what I have into enough.",
        "I am thankful for my body and all it does.",
        "I notice the beauty that surrounds me."
    ],
    "For Resilience": [
        "I release what I cannot control.",
        "I am strong and can handle whatever comes my way.",
        "I trust my ability to overcome challenges.",
        "This feeling is temporary and it will pass.",
        "I am stronger than my challenges.",
        "I bounce back from setbacks with grace.",
        "I have the courage to keep moving forward."
    ],
    "My Mantras": []
};


export const MANTRA_BACKGROUNDS = [
    'https://images.unsplash.com/photo-1508921340878-ba53e1f416ec?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1489619241022-db3d3e680a6a?q=80&w=1924&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554034483-043b353e84b2?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1444703686981-a3abbc4d42e2?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop'
];

export const BREATHING_METHODS: {
    id: string;
    name: string;
    description: string;
    purpose: string;
    technique: string;
    setupInstruction?: string;
    sequence: { state: 'inhale' | 'hold' | 'exhale' | 'hold-empty'; duration: number; text: string; }[];
}[] = [
    {
      id: 'box',
      name: 'Box (Square) Breathing',
      description: 'A quick “reset” during a hectic day.',
      purpose: 'Excellent for calming the nervous system and reducing stress. It enhances focus and control by creating a steady, predictable rhythm.',
      technique: '1. Inhale slowly through your nose for 4 counts.\n2. Hold your breath for 4 counts.\n3. Exhale slowly through your mouth for 4 counts.\n4. Hold the breath out for 4 counts.\n5. Repeat the cycle as long as feels comfortable.',
      sequence: [
        { state: 'inhale', duration: 4, text: 'Breathe In' },
        { state: 'hold', duration: 4, text: 'Hold' },
        { state: 'exhale', duration: 4, text: 'Breathe Out' },
        { state: 'hold-empty', duration: 4, text: 'Hold' },
      ],
    },
    {
      id: '4-7-8',
      name: '4-7-8 Relaxation Breath',
      description: 'Winding down before sleep or whenever tension spikes.',
      purpose: 'Known as the "relaxing breath," this technique is a powerful tool for reducing anxiety and promoting deep relaxation, making it ideal for falling asleep.',
      technique: '1. Exhale completely through your mouth, making a whoosh sound.\n2. Close your mouth and inhale quietly through your nose to a mental count of 4.\n3. Hold your breath for a count of 7.\n4. Exhale completely through your mouth, making a whoosh sound to a count of 8.\n5. This is one breath. Inhale again and repeat the cycle three more times for a total of four breaths.',
      setupInstruction: 'Keep the tip of your tongue behind your upper front teeth.',
      sequence: [
        { state: 'inhale', duration: 4, text: 'Breathe In' },
        { state: 'hold', duration: 7, text: 'Hold' },
        { state: 'exhale', duration: 8, text: 'Breathe Out' },
      ],
    },
    {
      id: 'diaphragmatic',
      name: 'Diaphragmatic (Belly) Breathing',
      description: 'Anchor yourself in a steady, mindful rhythm.',
      purpose: 'The foundation of most relaxation techniques, belly breathing encourages full oxygen exchange, which can slow the heartbeat and lower or stabilize blood pressure.',
      technique: '1. Lie on your back or sit comfortably.\n2. Place one hand on your upper chest and the other on your belly, just below your rib cage.\n3. Breathe in slowly through your nose, drawing the air in towards your lower belly. The hand on your chest should remain relatively still, while the one on your belly should rise.\n4. Exhale slowly through pursed lips. The hand on your belly will fall as you exhale.',
      setupInstruction: 'Place one hand on your belly to feel it rise and fall.',
      sequence: [
        { state: 'inhale', duration: 4, text: 'Breathe In' },
        { state: 'exhale', duration: 5, text: 'Breathe Out' },
      ],
    },
    {
      id: 'coherent',
      name: 'Coherent / Resonance Breathing',
      description: 'Gentle full-body calm that also supports heart-rate variability.',
      purpose: 'This simple technique aims to synchronize your respiratory rate with your heart rate, creating a state of "coherence" that promotes cardiovascular health and emotional balance.',
      technique: '1. Sit upright and relax your shoulders, finding a comfortable position.\n2. Inhale smoothly through your nose for a 5-count.\n3. Without pausing at the top, exhale smoothly for a 5-count.\n4. Continue this fluid, circular rhythm for 5-10 minutes, allowing your breath to feel effortless and balanced.',
      sequence: [
        { state: 'inhale', duration: 5, text: 'Breathe In' },
        { state: 'exhale', duration: 5, text: 'Breathe Out' },
      ],
    },
    {
      id: 'alternate-nostril',
      name: 'Alternate-Nostril Breathing (Nadi Shodhana)',
      description: 'Balance focus and calm when you feel mentally “scattered”.',
      purpose: 'A traditional yogic breathing practice said to harmonize the two hemispheres of the brain. It can reduce anxiety, improve focus, and promote a sense of overall well-being.',
      technique: '1. Hold your right hand up to your nose.\n2. Exhale completely and then use your right thumb to close your right nostril.\n3. Inhale through your left nostril.\n4. Close your left nostril with your ring finger, then open and exhale through the right nostril.\n5. Inhale through the right nostril.\n6. Close the right nostril, then open and exhale through the left. This completes one cycle.',
      setupInstruction: 'Use your thumb and ring finger to alternate nostrils.',
      sequence: [
        { state: 'inhale', duration: 4, text: 'Inhale Left' },
        { state: 'exhale', duration: 4, text: 'Exhale Right' },
        { state: 'inhale', duration: 4, text: 'Inhale Right' },
        { state: 'exhale', duration: 4, text: 'Exhale Left' },
      ],
    },
    {
      id: 'equal',
      name: 'Equal (Sama Vritti) Breathing',
      description: 'A quiet, rhythmic anchor for meditation.',
      purpose: 'This foundational breathing exercise brings balance and tranquility to the mind and body. By making the inhale and exhale equal in length, it calms the nervous system and encourages mental stillness.',
      technique: '1. Find a comfortable seated position.\n2. Begin by inhaling through your nose for a count of 4 or 5.\n3. Exhale through your nose for the same count.\n4. Focus on creating a smooth, even breath, without pausing between the inhale and exhale.',
      sequence: [
        { state: 'inhale', duration: 5, text: 'Breathe In' },
        { state: 'exhale', duration: 5, text: 'Breathe Out' },
      ],
    },
];

export const REFLECTION_PROMPTS = [
    "To begin, how are you feeling in this moment? Describe it in a few words.",
    "Thank you for sharing. What is one thought that has been on your mind today?",
    "What is one thing you're grateful for, no matter how small?",
    "Finally, what is a simple, kind action you can take for yourself tomorrow?",
];

export const CARRIER_URLS: { [key: string]: string } = {
  ups: 'https://www.ups.com/track?loc=en_US&tracknum=',
  fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
  usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
};

export const MOOD_OPTIONS = [
  { value: 1, emoji: '😔', label: 'Struggling' },
  { value: 2, emoji: '😟', label: 'Uneasy' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Excellent' },
];

export const SYMPTOM_TAGS = [
  // Challenges
  'Anxious', 'Fatigue', 'Irritable', 'Brain Fog',
  // Positives
  'Clarity', 'Creative', 'Calm', 'Focused', 'Uplifted', 'Relief',
];

export const INTENTION_SUGGESTIONS = [
  "To be present in each moment, without judgment.",
  "To listen to my body and give it what it needs.",
  "To treat myself with the same kindness I offer to others.",
  "To find joy in small, simple things.",
  "To release the need for control and trust the journey.",
  "To embrace my emotions as valid signals.",
  "To celebrate my progress, no matter how small.",
  "To practice patience with myself and my healing process.",
  "To seek connection and share my truth with someone I trust.",
  "To create space for rest and quiet contemplation.",
  "To let go of what I cannot change and focus on what I can.",
  "To nourish my mind with positive and hopeful thoughts.",
  "To acknowledge my strength and resilience.",
  "To forgive myself for past mistakes.",
  "To set a boundary that honors my well-being.",
  "To move my body in a way that feels good.",
  "To approach challenges with curiosity instead of fear.",
  "To be grateful for the gift of this day.",
  "To allow myself to be vulnerable and open.",
  "To find beauty in the world around me."
];


// SVG Icons
export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.07a4.5 4.5 0 01-1.897 1.13L6 21l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const PencilSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.375H6.375a2.25 2.25 0 00-2.25 2.25v11.25c0 1.242 1.008 2.25 2.25 2.25h11.25c1.242 0 2.25-1.008 2.25-2.25V13.5" />
  </svg>
);

export const ChatBubbleBottomCenterTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
);


export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const XMarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
    </svg>
);

export const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>
);

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);

export const ExpandIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

export const ShrinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h4.5M15 9l5.25-5.25M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
    </svg>
);

export const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);

export const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 18l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456L20.5 18l-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

export const PaperAirplaneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const FireIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.62a8.983 8.983 0 013.362-3.797A8.333 8.333 0 0112 6c1.233 0 2.417.32 3.362.877a8.333 8.333 0 01-1.482-3.663z" />
    </svg>
);
