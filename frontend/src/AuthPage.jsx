import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Brain, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, Loader2, Send } from 'lucide-react';
import { AnimatedThemeToggler } from './components/ui/AnimatedThemeToggler';

const AuthPage = ({ onLogin, onBackToLanding }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (formData.email === 'demo@example.com' || formData.email.includes('@')) {
                onLogin();
            } else {
                setError('Invalid credentials. Please try again.');
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground font-['DM_Sans',sans-serif]">
            {/* Background Decorative Particles */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[#1a73e8]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Header / Logo */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <button
                    onClick={onBackToLanding}
                    className="flex items-center gap-2 text-muted hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                </button>
                <div className="flex items-center gap-4">
                    <AnimatedThemeToggler />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center text-white shadow-lg shadow-accent-blue/20">
                            <Brain className="w-5 h-5" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tighter text-foreground">cogno</span>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-[440px] z-10">
                <div className="bg-surface rounded-[32px] border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 relative overflow-hidden">
                    {/* Progress Indicator */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-border">
                            <div className="h-full bg-[#1a73e8] animate-[loading_1.5s_ease-in-out_infinite]"></div>
                        </div>
                    )}

                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-['Plus_Jakarta_Sans',sans-serif] font-bold mb-3">
                            {isLogin ? 'Welcome back' : 'Create your account'}
                        </h2>
                        <p className="text-muted text-sm">
                            {isLogin ? 'Sign in to continue your learning journey' : 'Start your personalized adaptive learning experience'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm animate-fade-in">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required={!isLogin}
                                        className="w-full h-14 bg-background border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full h-14 bg-background border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Password</label>
                                {isLogin && <button type="button" className="text-xs font-bold text-[#1a73e8] hover:underline">Forgot?</button>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 bg-background border border-border rounded-2xl pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-[#1a73e8] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#185abc] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-[#1a73e8]/20 disabled:opacity-50 disabled:pointer-events-none mt-4"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                            <span className="relative px-4 bg-surface text-xs font-bold text-muted uppercase">Or continue with</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 h-12 border border-border rounded-2xl hover:bg-background transition-all font-medium text-sm">
                                <Chrome className="w-4 h-4" /> Google
                            </button>
                            <button className="flex items-center justify-center gap-2 h-12 border border-border rounded-2xl hover:bg-background transition-all font-medium text-sm">
                                <Github className="w-4 h-4" /> GitHub
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-muted">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1.5 font-bold text-foreground hover:text-[#1a73e8] transition-colors"
                    >
                        {isLogin ? 'Get started free' : 'Sign in here'}
                    </button>
                </p>
            </div>

            <style>{`
        @keyframes loading {
          0% { left: -100%; width: 50%; }
          100% { left: 100%; width: 50%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default AuthPage;
