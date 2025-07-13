import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Button } from './ui';
import { ExpandIcon, ShrinkIcon } from '../constants';

const TouchVisualizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const visualizerRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const hueRef = useRef(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        hue: number;
        saturation: number;
        lightness: number;
        life: number;
        maxLife: number;

        constructor(x: number, y: number, hue: number) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 4; // More substantial particles
            this.speedX = Math.random() * 4 - 2;
            this.speedY = Math.random() * 4 - 2;
            this.hue = hue + (Math.random() * 40 - 20); // Add color variation
            this.saturation = 100;
            this.lightness = 50 + Math.random() * 10;
            this.life = 0;
            this.maxLife = Math.random() * 100 + 100; // Longer particle life
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.15;
            this.lightness *= 0.98; // Gently fade out
            this.life++;
        }

        draw(ctx: CanvasRenderingContext2D) {
            const alpha = Math.max(0, this.lightness / 60);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slower fade for longer trails
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalCompositeOperation = 'lighter'; // For glowing effect

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const p = particlesRef.current[i];
            p.update();
            p.draw(ctx);
            if (p.size <= 0.2 || p.life > p.maxLife) {
                particlesRef.current.splice(i, 1);
            }
        }
        
        hueRef.current = (hueRef.current + 2) % 360; // Faster color shifting
        requestAnimationFrame(animate);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (let i = 0; i < 3; i++) {
             particlesRef.current.push(new Particle(x, y, hueRef.current));
        }
    }, []);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        e.preventDefault();
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            const touchHue = (hueRef.current + i * 40) % 360; 
            for (let j = 0; j < 2; j++) {
                 particlesRef.current.push(new Particle(x, y, touchHue));
            }
        }
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        e.preventDefault(); // prevent page scroll on canvas
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        // Iterate over all touches for multitouch support
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            // Give each finger a slightly different color for visual distinction
            const touchHue = (hueRef.current + i * 40) % 360; 
            for (let j = 0; j < 2; j++) {
                 particlesRef.current.push(new Particle(x, y, touchHue));
            }
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const container = visualizerRef.current;
        if (!container) return;

        let animationFrameId: number;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
            }
        });
        resizeObserver.observe(container);
        
        canvas.addEventListener('mousemove', handleMouseMove);
        // use passive: false to allow preventDefault
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        animationFrameId = requestAnimationFrame(animate);
        
        return () => {
            resizeObserver.disconnect();
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [animate, handleMouseMove, handleTouchStart, handleTouchMove]);

    const handleFullScreenToggle = () => {
        if (!visualizerRef.current) return;

        if (!document.fullscreenElement) {
            visualizerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    return (
        <div 
            ref={visualizerRef}
            className={
                isFullScreen 
                ? "fixed inset-0 z-50 bg-black" 
                : "w-full h-[24rem] bg-black rounded-lg relative overflow-hidden shadow-inner"
            }
        >
             <canvas ref={canvasRef} className="w-full h-full cursor-crosshair"></canvas>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-white/30 text-lg font-medium animate-pulse drop-shadow-lg" style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.2)'}}>Paint with light</p>
            </div>
            <Button
                variant="ghost"
                onClick={handleFullScreenToggle}
                className="absolute top-2 right-2 z-10 bg-black/20 text-white hover:bg-black/40"
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
            >
                {isFullScreen ? <ShrinkIcon className="h-5 w-5"/> : <ExpandIcon className="h-5 w-5"/>}
            </Button>
        </div>
    );
};

export default TouchVisualizer;