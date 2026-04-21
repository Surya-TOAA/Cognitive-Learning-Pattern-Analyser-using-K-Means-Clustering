import React, { useState, useEffect, useRef } from 'react';
import { Brain, ArrowRight, Play, ChevronLeft, ChevronRight, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AnimatedThemeToggler } from './components/ui/AnimatedThemeToggler';
import { LayoutTextFlip } from './components/ui/LayoutTextFlip';

/* --- UTILS --- */
class ParticleSystem {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.count = options.count || 100;
        this.colors = options.colors || ['#1a73e8', '#10b981', '#f59e0b', '#7c3aed'];
        this.mouse = { x: null, y: null };
        this.interactive = options.interactive || false;

        this.init();
        this.animate();

        if (this.interactive) {
            this.mouseHandler = (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            };
            window.addEventListener('mousemove', this.mouseHandler);
        }
    }

    init() {
        this.resize();
        this.resizeHandler = () => this.resize();
        window.addEventListener('resize', this.resizeHandler);

        for (let i = 0; i < this.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
        if (this.mouseHandler) window.removeEventListener('mousemove', this.mouseHandler);
        cancelAnimationFrame(this.animationId);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            if (this.interactive && this.mouse.x) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = this.mouse.x - rect.left;
                const mouseY = this.mouse.y - rect.top;
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.x += dx / 20;
                    p.y += dy / 20;
                }
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = 0.5;
            this.ctx.fill();
        });

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.particles[i].color;
                    this.ctx.globalAlpha = (100 - dist) / 500;
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

const LandingPage = ({ onGetStarted }) => {
    const [scrolled, setScrolled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [cursorVisible, setCursorVisible] = useState(false);
    const [cursorText, setCursorText] = useState('▶ Play Demo');
    const [heroTyped, setHeroTyped] = useState('');
    const [missionTyped, setMissionTyped] = useState('');
    const [ctaTyped, setCtaTyped] = useState('');

    // Refs for observers and canvases
    const heroCanvasRef = useRef(null);
    const leftCanvasRef = useRef(null);
    const rightCanvasRef = useRef(null);
    const ctaCanvasRef = useRef(null);
    const missionRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);

    const slides = [
        {
            title: "Student",
            copy: "Ace your exams with AI-powered study plans that adapt to your syllabus and test schedule.",
            link: "View student case →",
            color: "var(--background)",
            illustration: (
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-40">
                    <rect x="50" y="50" width="300" height="200" rx="20" fill="#1a73e8" fillOpacity="0.1" />
                    <rect x="80" y="80" width="240" height="15" rx="5" fill="#1a73e8" />
                    <rect x="80" y="110" width="180" height="15" rx="5" fill="#1a73e8" fillOpacity="0.6" />
                    <rect x="80" y="140" width="210" height="15" rx="5" fill="#1a73e8" fillOpacity="0.6" />
                    <circle cx="300" cy="200" r="40" fill="#10b981" />
                    <path d="M285 200l10 10 20-20" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
            )
        },
        {
            title: "Professional",
            copy: "Upskill faster with targeted learning paths built around your career goals and existing expertise.",
            link: "View professional case →",
            color: "var(--surface)",
            illustration: (
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-40">
                    <rect x="100" y="40" width="200" height="220" rx="10" fill="#7c3aed" fillOpacity="0.1" />
                    <circle cx="200" cy="100" r="30" fill="#7c3aed" />
                    <rect x="150" y="150" width="100" height="10" rx="5" fill="#7c3aed" fillOpacity="0.6" />
                    <rect x="130" y="180" width="140" height="10" rx="5" fill="#7c3aed" fillOpacity="0.6" />
                    <rect x="160" y="210" width="80" height="30" rx="15" fill="#7c3aed" />
                </svg>
            )
        },
        {
            title: "Lifelong Learner",
            copy: "Stay curious forever. Let cogno curate topics you love and connect ideas across disciplines.",
            link: "View learner case →",
            color: "var(--background)",
            illustration: (
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-40">
                    <path d="M50 250 Q100 50 150 200 T250 100 T350 220" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
                    <circle cx="50" cy="250" r="8" fill="#f59e0b" />
                    <circle cx="150" cy="200" r="8" fill="#f59e0b" />
                    <circle cx="250" cy="100" r="8" fill="#f59e0b" />
                    <circle cx="350" cy="220" r="8" fill="#f59e0b" />
                </svg>
            )
        }
    ];

    const typeEffect = (text, setter, delay = 35) => {
        let i = 0;
        setter('');
        const interval = setInterval(() => {
            setter(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, delay);
        return interval;
    };

    const missionTriggered = useRef(false);
    const ctaTriggered = useRef(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);

        // Init Particles
        const heroPs = new ParticleSystem(heroCanvasRef.current, { count: 120, interactive: true });
        const leftPs = new ParticleSystem(leftCanvasRef.current, { count: 30 });
        const rightPs = new ParticleSystem(rightCanvasRef.current, { count: 30, colors: ['#10b981', '#34d399'] });
        const ctaPs = new ParticleSystem(ctaCanvasRef.current, { count: 80, colors: ['#4a9eff', '#50fa7b', '#bd93f9'] });

        // Scroll Observers
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target === missionRef.current && !missionTriggered.current) {
                        missionTriggered.current = true;
                        typeEffect("cogno is your AI-powered learning companion, evolving education into the adaptive, intelligent era.", setMissionTyped, 25);
                    }
                    if (entry.target === ctaRef.current && !ctaTriggered.current) {
                        ctaTriggered.current = true;
                        typeEffect("Start your learning liftoff with cogno", setCtaTyped);
                    }
                }
            });
        }, { threshold: 0.15 });

        $$('.reveal').forEach(el => observer.observe(el));
        observer.observe(missionRef.current);
        observer.observe(ctaRef.current);

        // Hero Typing (only once)
        const heroText = "Learn smarter. Grow ";
        let i = 0;
        const interval = setInterval(() => {
            setHeroTyped(heroText.slice(0, i + 1));
            i++;
            if (i >= heroText.length) clearInterval(interval);
        }, 40);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            heroPs.destroy(); leftPs.destroy(); rightPs.destroy(); ctaPs.destroy();
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const $$ = (s) => document.querySelectorAll(s);

    return (
        <div className="landing-root bg-background text-foreground transition-opacity duration-700 font-['DM_Sans',sans-serif]" onMouseMove={handleMouseMove}>
            {/* Custom Cursor */}
            <div
                className="fixed pointer-events-none z-[10000] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
                style={{ left: cursorPos.x, top: cursorPos.y, transform: `translate(-50%, -50%) scale(${cursorVisible ? 1 : 0})` }}
            >
                <div className="bg-surface text-foreground px-5 py-2.5 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 whitespace-nowrap border border-border">
                    {cursorText}
                </div>
            </div>

            {/* Header */}
            <header className={`fixed top-0 left-0 w-full h-[64px] z-[1000] transition-all duration-300 ${scrolled ? 'bg-surface border-b border-border shadow-sm' : 'bg-surface/85 backdrop-blur-[10px]'}`}>
                <div className="container mx-auto px-[var(--page-margin)] h-full flex items-center justify-between">
                    <div className="flex items-center gap-3 font-heading font-bold text-xl text-foreground">
                        <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white"><Brain className="w-5 h-5" /></div>
                        cogno
                    </div>
                    <nav className="hidden lg:flex gap-6">
                        {['Features', 'Use Cases ▾', 'Pricing', 'Resources ▾'].map(link => (
                            <a key={link} href="#" className="text-sm font-medium text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-surface/5 px-3 py-2 rounded-lg transition-all">{link}</a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-4">
                        <AnimatedThemeToggler />
                        <button onClick={onGetStarted} className="text-sm font-medium text-muted hover:text-foreground">Sign In</button>
                        <button onClick={onGetStarted} className="bg-[#1a73e8] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#185abc] transition-all">Get Started Free</button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center pt-[64px]">
                <canvas ref={heroCanvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full"></canvas>
                <div className="relative z-10 max-w-[800px] px-6">
                    <div className="reveal inline-flex items-center gap-2 px-3 py-1.5 bg-background rounded-full mb-6 opacity-0 translate-y-5">
                        <span className="text-xs font-bold">Beta</span>
                        <span className="text-xs text-muted">cogno is now public</span>
                    </div>
                    <h1 className="reveal text-[clamp(2.5rem,7vw,4.5rem)] font-['Plus_Jakarta_Sans',sans-serif] font-bold mb-6 tracking-tight leading-[1.2] opacity-0 translate-y-5 flex flex-col items-center text-center gap-y-2">
                        <span className="block">{heroTyped.substring(0, 15)}</span>
                        <AnimatePresence>
                            {heroTyped.length > 15 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <LayoutTextFlip
                                        text={heroTyped.substring(15)}
                                        words={["faster.", "bigger.", "stronger.", "better."]}
                                        duration={2500}
                                        className="justify-center"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </h1>
                    <p className="reveal text-[clamp(1.1rem,3vw,1.5rem)] text-muted mb-10 opacity-0 translate-y-5 transition-all duration-1000 delay-[600ms]">
                        The AI-powered learning platform that adapts to you.
                    </p>
                    <div className="reveal flex gap-4 justify-center opacity-0 translate-y-5 transition-all duration-1000 delay-[800ms]">
                        <button onClick={onGetStarted} className="bg-[#1a73e8] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-[#1a73e8]/20">
                            Start Learning Free <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button className="bg-surface border border-border px-8 py-4 rounded-full font-bold hover:bg-background transition-all">Explore Features</button>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="container mx-auto px-[var(--page-margin)] py-24">
                <div className="grid lg:grid-cols-[4fr,6fr] gap-12 items-center">
                    <div className="reveal opacity-0 translate-y-10 transition-all duration-700">
                        <span className="text-[12px] font-bold text-muted uppercase tracking-widest mb-3 block">See It In Action</span>
                        <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-heading font-bold mb-4">Watch how cogno adapts to your learning style</h2>
                        <p className="text-muted">Our AI analyzes your pace, patterns, and preferences in real time to serve content exactly when and how you need it.</p>
                    </div>
                    <div
                        onMouseEnter={() => { setCursorVisible(true); setCursorText('▶ Play Demo'); }}
                        onMouseLeave={() => setCursorVisible(false)}
                        className="reveal relative bg-gradient-to-br from-[#1a73e8]/30 to-[#7c3aed]/30 dark:from-[#1a73e8]/20 dark:to-[#7c3aed]/20 aspect-[16/10] rounded-[36px] flex items-center justify-center p-10 overflow-hidden cursor-none opacity-0 translate-y-10 transition-all duration-700 delay-200 border border-border"
                    >
                        <div className="bg-[#111827] w-full h-full rounded-2xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-white font-bold text-sm">Your Learning Session</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[#ff5f57]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#28c940]"></div>
                                </div>
                            </div>
                            <div className="h-2 bg-surface/10 rounded-full mb-8 overflow-hidden">
                                <div className="h-full bg-[#1a73e8] w-[73%] transition-[width] duration-[2000ms] delay-500"></div>
                            </div>
                            <div className="flex gap-3 mb-8">
                                {['Algebra ✓', 'Physics →', 'Chemistry ○'].map((p, i) => (
                                    <div key={i} className={`px-3 py-1.5 rounded-full text-[10px] border ${i === 1 ? 'border-[#1a73e8] text-white bg-[#1a73e8]/10' : 'border-white/10 text-[#ccc]'}`}>{p}</div>
                                ))}
                            </div>
                            <div className="bg-[#1a73e8] text-white p-4 rounded-xl rounded-bl-none text-xs max-w-[80%] shadow-lg">
                                Great work! You've mastered conceptual foundations. Let's try this applied problem next to push your analytical skills.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <div className="py-16 overflow-hidden">
                <div className="flex justify-center gap-6 mb-16 px-10">
                    {[
                        'books', 'brain', 'bulb', 'dna', 'earth', 'fire',
                        'lightning', 'microscope', 'microsoft-paint', 'robot',
                        'rocket', 'ruby', 'books', 'brain', 'bulb', 'dna', 'earth', 'fire'
                    ].map((icon, i) => (
                        <div
                            key={i}
                            className="w-[98px] h-[98px] rounded-full border border-border bg-[#b7bfd9]/10 flex items-center justify-center shrink-0 animate-[float_3s_ease-in-out_infinite]"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        >
                            <img
                                src={`/ICO/icons8-${icon}-100.png`}
                                alt={icon}
                                className="w-12 h-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
                            />
                        </div>
                    ))}
                </div>
                <div className="container mx-auto px-[var(--page-margin)]">
                    <h2 ref={missionRef} className="max-w-[900px] mx-auto text-[clamp(1.5rem,4vw,2.5rem)] font-medium text-center leading-[1.2] min-h-[3.6em]">
                        {missionTyped}
                    </h2>
                </div>
            </div>

            {/* Features Explorer */}
            <section id="features" className="container mx-auto px-[var(--page-margin)] py-32 space-y-32">
                <div className="grid lg:grid-cols-[1fr,1.5fr] gap-16 items-center reveal opacity-0 translate-y-10 transition-all duration-700">
                    <div>
                        <h3 className="text-3xl font-heading font-bold mb-6">Adaptive Learning Engine</h3>
                        <p className="text-muted">Our AI tracks your cognitive patterns, adjusting difficulty, pacing, and content type in real time. No two learning journeys are alike.</p>
                    </div>
                    <div className="bg-gradient-to-b from-accent-blue/10 to-accent-blue/5 dark:from-accent-blue/20 dark:to-transparent h-[400px] rounded-[36px] flex items-center justify-center p-10 border border-border">
                        <div className="bg-surface p-8 rounded-2xl shadow-lg w-full max-w-[300px] text-center">
                            <span className="text-[10px] font-bold text-muted uppercase mb-2 block">Difficulty Level</span>
                            <h4 className="text-xl font-bold mb-6 text-foreground">Advanced</h4>
                            <div className="h-3 bg-gray-100 rounded-full mb-4 overflow-hidden"><div className="h-full bg-[#1a73e8] w-[85%]"></div></div>
                            <p className="text-[10px] text-muted">Optimizing for high-performance retention</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1.5fr,1fr] gap-16 items-center reveal opacity-0 translate-y-10 transition-all duration-700">
                    <div className="lg:col-start-2 lg:row-start-1">
                        <h3 className="text-3xl font-heading font-bold mb-6">Spaced Repetition System</h3>
                        <p className="text-muted">Evidence-based scheduling surfaces concepts at exactly the right moment before you forget them.</p>
                    </div>
                    <div className="bg-gradient-to-b from-accent-green/10 to-accent-green/5 dark:from-accent-green/20 dark:to-transparent h-[400px] rounded-[36px] p-10 lg:col-start-1 lg:row-start-1 border border-border">
                        <svg className="w-full h-full" viewBox="0 0 400 200">
                            <path d="M0,180 Q100,180 200,100 T400,20" fill="none" stroke="#1a73e8" strokeWidth="3" className="animate-[draw_2s_ease-out_forwards]" />
                            <circle cx="200" cy="100" r="6" fill="#1a73e8" className="animate-pulse" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Slider Section */}
            <section className="bg-background py-32 overflow-hidden">
                <div className="container mx-auto px-[var(--page-margin)]">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-[12px] font-bold text-muted uppercase tracking-widest mb-3 block">Use Cases</span>
                            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-heading font-bold">Built for every kind of learner</h2>
                        </div>
                        <p className="max-w-[400px] text-muted">Whether you're a student, professional, or lifelong learner, cogno meets you where you are.</p>
                    </div>

                    <div className="relative">
                        <div
                            className="flex gap-6 transition-transform duration-700 cubic-bezier(0.16,1,0.3,1)"
                            style={{ transform: `translateX(-${currentSlide * 85}%)` }}
                        >
                            {slides.map((s, i) => (
                                <div
                                    key={i}
                                    onMouseEnter={() => { setCursorVisible(true); setCursorText('▶ View Story'); }}
                                    onMouseLeave={() => setCursorVisible(false)}
                                    className="min-w-[85%] aspect-[16/9] rounded-[36px] relative overflow-hidden cursor-none border border-border flex items-center justify-center p-12"
                                    style={{ background: s.color }}
                                >
                                    <div className="w-full h-full">
                                        {s.illustration}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent p-10 flex items-end">
                                        <h3 className="text-foreground text-3xl font-bold">{s.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 min-h-[100px]">
                            <p className="text-xl max-w-[600px] transition-all duration-300">{slides[currentSlide].copy}</p>
                            <a href="#" className="text-[#1a73e8] font-bold mt-4 block">{slides[currentSlide].link}</a>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                disabled={currentSlide === 0}
                                onClick={() => setCurrentSlide(prev => prev - 1)}
                                className="w-16 h-12 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-all disabled:opacity-30"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                disabled={currentSlide === slides.length - 1}
                                onClick={() => setCurrentSlide(prev => prev + 1)}
                                className="w-16 h-12 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-all disabled:opacity-30"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Split Pricing */}
            <section className="grid lg:grid-cols-2 border-t border-border" id="pricing">
                <div className="relative p-24 text-center border-r border-border overflow-hidden">
                    <canvas ref={leftCanvasRef} className="absolute inset-0 pointer-events-none opacity-20"></canvas>
                    <span className="inline-block px-4 py-1.5 bg-foreground/5 rounded-full text-[10px] font-bold mb-6">Free Forever</span>
                    <h3 className="text-4xl font-heading font-bold mb-4">For Students</h3>
                    <p className="text-muted mb-10">Start your journey with core adaptive features.</p>
                    <button onClick={onGetStarted} className="bg-[#1a73e8] text-white px-8 py-4 rounded-full font-bold hover:bg-[#185abc] transition-all">Get Started Free</button>
                </div>
                <div className="relative p-24 text-center overflow-hidden">
                    <canvas ref={rightCanvasRef} className="absolute inset-0 pointer-events-none opacity-20"></canvas>
                    <span className="inline-block px-4 py-1.5 bg-[#10b981]/10 text-[#10b981] rounded-full text-[10px] font-bold mb-6">Coming Soon</span>
                    <h3 className="text-4xl font-heading font-bold mb-4">For Organizations</h3>
                    <p className="text-muted mb-10">Level up your team with enterprise intelligence.</p>
                    <button className="bg-surface border border-border px-8 py-4 rounded-full font-bold hover:bg-background transition-all">Notify Me</button>
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-[var(--page-margin)] py-32">
                <div className="bg-surface rounded-[36px] p-24 relative overflow-hidden text-foreground border border-border">
                    <canvas ref={ctaCanvasRef} className="absolute inset-0 pointer-events-none opacity-30"></canvas>
                    <div className="relative z-10 max-w-[600px]">
                        <h2 ref={ctaRef} className="text-5xl font-heading font-bold mb-6 leading-[1.1] min-h-[2.2em]">
                            {ctaTyped}
                        </h2>
                        <p className="text-muted text-lg mb-12">Join 50,000+ learners already growing smarter with cogno.</p>
                        <div className="flex gap-4">
                            <button onClick={onGetStarted} className="bg-accent-blue text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-accent-blue/20">Start Free — Web App</button>
                            <button className="bg-transparent border border-border px-8 py-4 rounded-full font-bold hover:bg-surface/10 transition-all">Download for iOS</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Wordmark */}
            <div className="px-[var(--page-margin)] py-16 opacity-10">
                <svg className="w-full h-auto" viewBox="0 0 800 120">
                    <text x="50%" y="80%" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontWeight="700" fontSize="100">COGNO</text>
                </svg>
            </div>

            <footer className="container mx-auto px-[var(--page-margin)] pt-24 pb-12 border-t border-border">
                <div className="grid md:grid-cols-[1.5fr,1fr,1fr] gap-16 mb-24">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center text-white shadow-lg shadow-accent-blue/20">
                                <Brain className="w-6 h-6" />
                            </div>
                            <span className="font-heading font-bold text-2xl tracking-tight">cogno</span>
                        </div>
                        <p className="text-sm text-muted max-w-[300px]">Learn without limits. The intelligent companion for your educational journey.</p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-muted uppercase mb-6 tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {['Features', 'Pricing', 'Changelog', 'Beta Access'].map(l => <li key={l} className="cursor-pointer hover:text-[#1a73e8] transition-colors">{l}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-muted uppercase mb-6 tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {['About Us', 'Use Cases', 'Documentation', 'Privacy Policy'].map(l => <li key={l} className="cursor-pointer hover:text-[#1a73e8] transition-colors">{l}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-6 text-[10px] font-bold text-muted uppercase tracking-widest">
                    <span>© 2026 cogno Inc. · Made with ❤️ for learners</span>
                    <div className="flex gap-8">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Manage Cookies</span>
                    </div>
                </div>
            </footer>

            <style>{`
                :root { 
                    --page-margin: clamp(24px, 5vw, 96px); 
                    --accent: #1a73e8;
                    --heading-font: 'Plus Jakarta Sans', sans-serif;
                    --body-font: 'DM Sans', sans-serif;
                }
                .landing-root {
                    font-family: var(--body-font);
                    -webkit-font-smoothing: antialiased;
                }
                .landing-root h1, .landing-root h2, .landing-root h3, .landing-root h4 {
                    font-family: var(--heading-font);
                }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-35px); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes draw { to { stroke-dashoffset: 0; } }
                @keyframes blink { 50% { opacity: 0; } }
                .cursor {
                    display: inline-block;
                    width: 2px;
                    height: 1em;
                    background: var(--accent);
                    margin-left: 2px;
                    animation: blink 0.5s infinite;
                    vertical-align: middle;
                }
                .reveal {
                    opacity: 0;
                    transform: translateY(40px);
                    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
