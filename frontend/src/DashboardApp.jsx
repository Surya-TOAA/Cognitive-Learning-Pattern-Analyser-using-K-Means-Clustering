import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import {
    LayoutDashboard, Brain, BookOpen, Sparkles, Timer,
    TrendingUp, Calendar, Zap, Award, Flame,
    ChevronRight, Filter, MoreHorizontal, CheckCircle2,
    AlertCircle, ArrowUpRight, ArrowDownRight, Search,
    Plus, X, Send, Play, Pause, Square,
    MoreVertical, Clock, History, BarChart3, User, LogOut, Settings, Target, CameraOff
} from 'lucide-react';
import { AnimatedThemeToggler } from './components/ui/AnimatedThemeToggler';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MOCK DATA (Defined at top)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const MOCK_LEARNER = {
    name: "Alex Johnson",
    level: 7,
    xp: 4250,
    totalXp: 10000,
    streak: 14,
    joinDate: "Jan 2024",
    avatar: "AJ"
};

const MOCK_WEEKLY_PERFORMANCE = [
    { day: 'Mon', score: 65, focus: 82, retention: 70 },
    { day: 'Tue', score: 72, focus: 75, retention: 74 },
    { day: 'Wed', score: 68, focus: 88, retention: 72 },
    { day: 'Thu', score: 85, focus: 92, retention: 80 },
    { day: 'Fri', score: 78, focus: 80, retention: 82 },
    { day: 'Sat', score: 90, focus: 95, retention: 88 },
    { day: 'Sun', score: 82, focus: 85, retention: 84 },
];

const MOCK_COGNITIVE_PROFILE = [
    { trait: 'Visual', value: 88 },
    { trait: 'Auditory', value: 45 },
    { trait: 'Kinesthetic', value: 65 },
    { trait: 'Reading', value: 72 },
    { trait: 'Analytical', value: 92 },
    { trait: 'Creative', value: 80 },
];

const MOCK_TOPICS = [
    { id: 1, topic: "Neurophysics", emoji: "🧠", mastery: 82, sessions: 24, lastStudied: "1d ago", nextReview: "Tomorrow", sparkline: [65, 70, 68, 80, 75, 82, 82], class: "Class 12", subject: "Biology", chapter: "Nervous System" },
    { id: 2, topic: "Advanced Calculas", emoji: "📐", mastery: 45, sessions: 12, lastStudied: "3d ago", nextReview: "Due now!", sparkline: [40, 45, 42, 38, 45, 40, 45], class: "Class 12", subject: "Math", chapter: "Calculus" },
    { id: 3, topic: "Cognitive Psych", emoji: "💭", mastery: 74, sessions: 18, lastStudied: "2d ago", nextReview: "2 days", sparkline: [60, 65, 70, 72, 68, 74, 74], class: "Class 11", subject: "Psychology", chapter: "Cognition" },
    { id: 4, topic: "Machine Learning", emoji: "🤖", mastery: 91, sessions: 32, lastStudied: "5h ago", nextReview: "3 days", sparkline: [85, 88, 87, 90, 92, 91, 91], class: "University", subject: "CS", chapter: "Neural Networks" },
    { id: 5, topic: "Philosophy", emoji: "🏺", mastery: 58, sessions: 8, lastStudied: "4d ago", nextReview: "Due now!", sparkline: [50, 55, 52, 58, 55, 60, 58], class: "University", subject: "Humanities", chapter: "Ethics" },
    { id: 6, topic: "Microbiology", emoji: "🧬", mastery: 68, sessions: 15, lastStudied: "6d ago", nextReview: "Tomorrow", sparkline: [62, 64, 66, 60, 68, 65, 68], class: "Class 11", subject: "Biology", chapter: "Microbes" },
    { id: 7, topic: "Macro Economics", emoji: "📉", mastery: 77, sessions: 20, lastStudied: "1w ago", nextReview: "4 days", sparkline: [70, 72, 75, 74, 78, 77, 77], class: "Class 12", subject: "Economics", chapter: "GDP" },
    { id: 8, topic: "Art History", emoji: "🎨", mastery: 85, sessions: 14, lastStudied: "3d ago", nextReview: "5 days", sparkline: [80, 82, 85, 84, 86, 85, 85], class: "University", subject: "Arts", chapter: "Renaissance" },
];

const MOCK_RETENTION_CURVE = [
    { day: 1, natural: 100, withReview: 100 },
    { day: 2, natural: 80, withReview: 95 },
    { day: 4, natural: 60, withReview: 92 },
    { day: 7, natural: 45, withReview: 90 },
    { day: 14, natural: 30, withReview: 88 },
    { day: 21, natural: 20, withReview: 86 },
    { day: 30, natural: 15, withReview: 85 },
];

const MOCK_HEATMAP_DATA = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 6))
);

const MOCK_ACTIVITY = [
    { id: 1, time: "2h ago", action: "Quiz completed", topic: "Machine Learning", score: 95, xp: 150, type: "Quiz" },
    { id: 2, time: "5h ago", action: "Flashcard review", topic: "Neurophysics", score: 88, xp: 80, type: "Flashcard" },
    { id: 3, time: "Yesterday", action: "Active recall session", topic: "Cognitive Psych", score: 72, xp: 120, type: "Test" },
    { id: 4, time: "Yesterday", action: "Note synthesis", topic: "Microbiology", score: null, xp: 50, type: "Flashcard" },
    { id: 5, time: "2 days ago", action: "Full unit test", topic: "Advanced Calculas", score: 45, xp: 200, type: "Test" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CLAUDE API INTEGRATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

async function callClaude(systemPrompt, userMessage) {
    // Replace with actual instruction: Use fetch() to call https://api.anthropic.com/v1/messages
    // Instructions say: Delivering as a single file, but in a real app this would use an API key. 
    // We'll simulate the response for the demo but keep the structure.

    console.log("Calling Claude API...");

    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (userMessage.includes("insights")) {
        return {
            content: [
                {
                    text: JSON.stringify([
                        {
                            type: "Pattern",
                            title: "Peak Performance Synchronization",
                            body: "Your analytical focus peaks between 10 AM and 12 PM. However, you are currently studying high-complexity topics like Machine Learning in the evenings.",
                            priority: "medium",
                            actionItems: ["Shift ML sessions to morning block", "Use evenings for kinesthetic learning tasks"]
                        },
                        {
                            type: "Alert",
                            title: "Retention Decay in Advanced Calculus",
                            body: "Your mastery in Advanced Calculus has dropped from 65% to 45% due to missed spaced repetition intervals.",
                            priority: "high",
                            actionItems: ["Schedule a 30-minute review session today", "Re-baseline your recall for Unit 4"]
                        },
                        {
                            type: "Trend",
                            title: "Visual-Analytical Correlation",
                            body: "There is a strong positive correlation between your visual content engagement and quiz scores. You perform 24% better on topics supported by diagrams.",
                            priority: "low",
                            actionItems: ["Use diagramming tools for Microbiology", "Seek visual summaries for Philosophy"]
                        },
                        {
                            type: "Recommendation",
                            title: "Interleaving Strategy",
                            body: "You've been binge-studying Neurophysics for 3 days. Cognitive load analysis suggests high fatigue risk.",
                            priority: "medium",
                            actionItems: ["Switch to Art History for 45 minutes", "Practice interleaved retrieval practice tomorrow"]
                        }
                    ])
                }
            ]
        };
    }

    return {
        content: [{ text: "As your AI learning coach, I've analyzed your data. You seem to excel in analytical tasks but face a steep forgetting curve in mathematical subjects. I recommend using the Feynman technique for Calculus to bridge the conceptual gap." }]
    };
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   REUSABLE COMPONENTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const StatCard = ({ title, value, trend, icon: Icon, colorClass, delay = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const isPercent = typeof value === 'string' && value.includes('%');
        const numericValue = parseInt(value);
        const duration = 1000;
        const interval = 20;
        const steps = duration / interval;
        const increment = numericValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setDisplayValue(numericValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, interval);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className={`stat-card flex items-center justify-between animate-fade-in hover:border-gray-600 transition-all duration-300`} style={{ animationDelay: `${delay}ms` }}>
            <div>
                <p className="text-sm font-medium text-muted mb-1 font-body">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold font-heading text-text">
                        {displayValue}{typeof value === 'string' && value.includes('%') ? '%' : ''}{typeof value === 'string' && value.includes('🔥') ? ' 🔥' : ''}
                    </h3>
                    {trend && (
                        <span className={`text-xs font-semibold flex items-center ${trend >= 0 ? 'text-accent-green' : 'text-danger'}`}>
                            {trend >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                            {Math.abs(trend)}%
                        </span>
                    )}
                </div>
            </div>
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </div>
    );
};

const CircularProgress = ({ value, size = 60, strokeWidth = 5, color = "#00d4ff" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <span className="absolute text-xs font-bold font-heading">{value}%</span>
        </div>
    );
};

const TopicCard = ({ topic, onDetail }) => {
    const isCritical = topic.mastery < 60;
    const isModerate = topic.mastery >= 60 && topic.mastery < 80;
    const color = isCritical ? '#ef4444' : isModerate ? '#f59e0b' : '#10b981';

    return (
        <div className="stat-card group animate-fade-in hover:glow-blue transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                    <div className="text-2xl p-2 bg-surface rounded-lg">{topic.emoji}</div>
                    <div>
                        <h4 className="font-heading font-bold text-lg">{topic.topic}</h4>
                        <p className="text-xs text-muted">Sessions: {topic.sessions}</p>
                    </div>
                </div>
                <CircularProgress value={topic.mastery} color={color} size={50} />
            </div>

            <div className="flex items-center gap-2 mb-4 text-xs">
                <span className={`px-2 py-1 rounded-full ${topic.nextReview === "Due now!" ? 'bg-danger bg-opacity-20 text-danger animate-pulse' : 'bg-surface text-muted'}`}>
                    {topic.nextReview === "Due now!" ? 'Review Due!' : `Next: ${topic.nextReview}`}
                </span>
                <span className="text-muted">Last: {topic.lastStudied}</span>
            </div>

            <div className="h-10 w-full mb-4 opacity-50">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={topic.sparkline.map((v, i) => ({ v, i }))}>
                        <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-lg bg-accent-blue text-background font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">
                    Study Now
                </button>
                <button
                    onClick={() => onDetail(topic)}
                    className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-surface transition-all"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

const HeatmapGrid = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[700px]">
                <div className="flex mb-1">
                    <div className="w-10"></div>
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="flex-1 text-[8px] text-muted text-center">{i}h</div>
                    ))}
                </div>
                {MOCK_HEATMAP_DATA.map((row, i) => (
                    <div key={i} className="flex items-center gap-1 mb-1">
                        <div className="w-10 text-[10px] text-muted font-bold">{days[i]}</div>
                        {row.map((val, j) => (
                            <div
                                key={j}
                                className="flex-1 aspect-square rounded-[2px] border border-background transition-colors hover:border-text group relative"
                                style={{
                                    backgroundColor:
                                        val === 0 ? 'var(--border)' :
                                            val === 1 ? 'rgba(26, 115, 232, 0.2)' :
                                                val === 2 ? 'rgba(26, 115, 232, 0.4)' :
                                                    val === 3 ? 'rgba(26, 115, 232, 0.6)' :
                                                        val === 4 ? 'rgba(26, 115, 232, 0.8)' : '#1a73e8'
                                }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-surface text-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                    {days[i]} {j}:00 — {val} sessions, avg {80 + val * 2}%
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background bg-opacity-80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-xl font-heading font-bold">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-surface rounded-xl"></div>
        <div className="h-40 bg-surface rounded-xl"></div>
        <div className="h-40 bg-surface rounded-xl"></div>
    </div>
);

const InsightCard = ({ insight, index }) => {
    const Icon = insight.type === 'Pattern' ? Brain : insight.type === 'Alert' ? Zap : insight.type === 'Trend' ? TrendingUp : Target;
    const priorityColor = insight.priority === 'high' ? 'bg-danger' : insight.priority === 'medium' ? 'bg-accent-amber' : 'bg-accent-green';
    const typeColor = insight.type === 'Pattern' ? 'text-accent-blue' : insight.type === 'Alert' ? 'text-danger' : insight.type === 'Trend' ? 'text-accent-purple' : 'text-accent-green';

    return (
        <div
            className="stat-card animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-surface bg-opacity-5 ${typeColor}`}>
                    {insight.type === 'Pattern' ? <Brain className="w-5 h-5" /> :
                        insight.type === 'Alert' ? <Zap className="w-5 h-5" /> :
                            insight.type === 'Trend' ? <TrendingUp className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${priorityColor} text-background`}>
                    {insight.priority}
                </span>
            </div>
            <h4 className="font-heading font-bold text-lg mb-2">{insight.title}</h4>
            <p className="text-sm text-muted mb-4 leading-relaxed">{insight.body}</p>

            <details className="group">
                <summary className="text-xs font-bold text-accent-blue cursor-pointer list-none flex items-center justify-between group-open:mb-3">
                    <span>Action Items</span>
                    <Plus className="w-3 h-3 group-open:rotate-45 transition-transform" />
                </summary>
                <ul className="space-y-2 mt-2">
                    {insight.actionItems.map((item, i) => (
                        <li key={i} className="text-xs text-text flex gap-2 items-start">
                            <CheckCircle2 className="w-3 h-3 mt-0.5 text-accent-green flex-shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </details>

            <div className="flex gap-3 mt-6">
                <button className="flex-1 py-1.5 rounded-lg bg-surface text-xs font-bold hover:bg-border transition-all">Dismiss</button>
                <button className="flex-1 py-1.5 rounded-lg bg-accent-blue bg-opacity-20 text-accent-blue text-xs font-bold hover:bg-opacity-30 transition-all border border-accent-blue border-opacity-30">Implement</button>
            </div>
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VIEW 1: DASHBOARD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const DashboardView = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Overall Mastery" value="78%" trend={4} icon={Award} colorClass="bg-accent-blue" delay={0} />
                <StatCard title="Study Streak" value="14" trend={0} icon={Flame} colorClass="bg-accent-amber" delay={100} />
                <StatCard title="Topics Active" value="6" trend={2} icon={BookOpen} colorClass="bg-accent-purple" delay={200} />
                <StatCard title="AI Insights" value="12" trend={15} icon={Sparkles} colorClass="bg-accent-green" delay={300} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 stat-card min-h-[400px]">
                    <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent-blue" />
                        Weekly Performance
                    </h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MOCK_WEEKLY_PERFORMANCE}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" vertical={false} />
                                <XAxis dataKey="day" stroke="#5f6368" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#5f6368" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="#1a73e8" strokeWidth={3} dot={{ r: 4, fill: "#1a73e8" }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="focus" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: "#7c3aed" }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="retention" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 stat-card min-h-[400px]">
                    <h4 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-accent-purple" />
                        Cognitive Style
                    </h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={MOCK_COGNITIVE_PROFILE}>
                                <PolarGrid stroke="#f1f3f4" />
                                <PolarAngleAxis dataKey="trait" stroke="#5f6368" fontSize={10} />
                                <Radar
                                    name="Learner"
                                    dataKey="value"
                                    stroke="#1a73e8"
                                    fill="#1a73e8"
                                    fillOpacity={0.1}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="stat-card">
                <h4 className="font-heading font-bold text-lg mb-6">Recent Activity</h4>
                <div className="space-y-4">
                    {MOCK_ACTIVITY.map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${act.type === 'Quiz' ? 'bg-accent-blue' :
                                    act.type === 'Flashcard' ? 'bg-accent-green' : 'bg-accent-purple'
                                    } bg-opacity-10 text-xs font-bold uppercase`}>
                                    {act.type}
                                </div>
                                <div>
                                    <p className="text-sm font-bold">{act.action}</p>
                                    <p className="text-xs text-muted">{act.topic} • {act.time}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                {act.score && <p className="text-sm font-bold text-accent-blue">{act.score}%</p>}
                                <p className="text-xs text-accent-green">+{act.xp} XP</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VIEW 2: LEARNING PATTERNS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const LearningPatternsView = () => {
    return (
        <div className="space-y-6">
            <div className="stat-card">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-heading font-bold text-lg flex items-center gap-2">
                        <History className="w-5 h-5 text-danger" />
                        Forgetting Curve & Spaced Repetition
                    </h4>
                    <button className="px-4 py-2 bg-accent-blue text-background font-bold rounded-lg text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                        <Plus className="w-4 h-4" /> Schedule Review
                    </button>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_RETENTION_CURVE}>
                            <defs>
                                <linearGradient id="colorNatural" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
                            <XAxis dataKey="day" label={{ value: 'Days Since Study', position: 'insideBottom', offset: -5, fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--text-muted)" fontSize={12} />
                            <YAxis label={{ value: 'Recall %', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 10 }} stroke="var(--text-muted)" fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                            />
                            <Area type="monotone" dataKey="natural" stroke="#ef4444" fillOpacity={1} fill="url(#colorNatural)" strokeWidth={2} />
                            <Area type="monotone" dataKey="withReview" stroke="#10b981" fillOpacity={1} fill="url(#colorReview)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <p className="mt-4 text-xs text-muted italic flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-amber" />
                    Spaced repetition provides a 4.2x retention lift by Day 30. Your crossover point is Day 2.
                </p>
            </div>

            <div className="stat-card">
                <h4 className="font-heading font-bold text-lg mb-4">Your Cognitive Heatmap — Peak hours highlighted</h4>
                <HeatmapGrid />
            </div>

            <div className="stat-card">
                <h4 className="font-heading font-bold text-lg mb-6">Learning Style Breakdown</h4>
                <div className="space-y-4">
                    {MOCK_COGNITIVE_PROFILE.map((item, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-bold">{item.trait}</span>
                                <span className="text-muted">{item.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-accent-blue to-transparent rounded-full animate-fade-in"
                                    style={{ width: `${item.value}%`, transition: 'width 1s ease-out' }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">
                                {item.value > 80 ? 'High Proficiency' : item.value > 50 ? 'Moderate Adaptability' : 'Developing Area'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VIEW 3: TOPIC MASTERY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TopicMasteryView = () => {
    const [filter, setFilter] = useState('All');
    const [selectedClass, setSelectedClass] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [selectedChapter, setSelectedChapter] = useState('All');
    const [selectedTopic, setSelectedTopic] = useState(null);

    // Dynamic Filter Options
    const classOptions = useMemo(() => ['All', ...new Set(MOCK_TOPICS.map(t => t.class))], []);
    const subjectOptions = useMemo(() => ['All', ...new Set(MOCK_TOPICS.filter(t => selectedClass === 'All' || t.class === selectedClass).map(t => t.subject))], [selectedClass]);
    const chapterOptions = useMemo(() => ['All', ...new Set(MOCK_TOPICS.filter(t =>
        (selectedClass === 'All' || t.class === selectedClass) &&
        (selectedSubject === 'All' || t.subject === selectedSubject)
    ).map(t => t.chapter))], [selectedClass, selectedSubject]);

    const filteredTopics = useMemo(() => {
        return MOCK_TOPICS.filter(t => {
            const matchesMastery = filter === 'All' || (t.mastery > 80 ? filter === 'Mastered' : t.mastery > 60 ? filter === 'In Progress' : filter === 'Critical');
            const matchesClass = selectedClass === 'All' || t.class === selectedClass;
            const matchesSubject = selectedSubject === 'All' || t.subject === selectedSubject;
            const matchesChapter = selectedChapter === 'All' || t.chapter === selectedChapter;
            return matchesMastery && matchesClass && matchesSubject && matchesChapter;
        });
    }, [filter, selectedClass, selectedSubject, selectedChapter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-surface p-4 rounded-2xl border border-border shadow-sm">
                <div className="flex flex-wrap gap-2">
                    {['All', 'Critical', 'In Progress', 'Mastered'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${filter === f ? 'bg-accent-blue text-white border-accent-blue shadow-lg shadow-accent-blue/20' : 'bg-surface text-muted border-border hover:border-muted'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none relative">
                        <select
                            value={selectedClass}
                            onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject('All'); setSelectedChapter('All'); }}
                            className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2 pr-10 text-xs font-bold focus:outline-none focus:border-accent-blue cursor-pointer"
                        >
                            <option value="All">All Classes</option>
                            {classOptions.filter(o => o !== 'All').map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
                    </div>

                    <div className="flex-1 md:flex-none relative">
                        <select
                            value={selectedSubject}
                            onChange={(e) => { setSelectedSubject(e.target.value); setSelectedChapter('All'); }}
                            className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2 pr-10 text-xs font-bold focus:outline-none focus:border-accent-blue cursor-pointer"
                        >
                            <option value="All">All Subjects</option>
                            {subjectOptions.filter(o => o !== 'All').map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
                    </div>

                    <div className="flex-1 md:flex-none relative">
                        <select
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                            className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2 pr-10 text-xs font-bold focus:outline-none focus:border-accent-blue cursor-pointer"
                        >
                            <option value="All">All Chapters</option>
                            {chapterOptions.filter(o => o !== 'All').map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {filteredTopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTopics.map(topic => (
                        <TopicCard key={topic.id} topic={topic} onDetail={setSelectedTopic} />
                    ))}
                </div>
            ) : (
                <div className="stat-card p-20 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
                        <Filter className="w-8 h-8 text-muted" />
                    </div>
                    <div>
                        <h4 className="font-heading font-bold text-lg">No topics found</h4>
                        <p className="text-muted text-sm">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                    <button
                        onClick={() => { setFilter('All'); setSelectedClass('All'); setSelectedSubject('All'); setSelectedChapter('All'); }}
                        className="text-accent-blue font-bold text-sm hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            <Modal
                isOpen={!!selectedTopic}
                onClose={() => setSelectedTopic(null)}
                title={selectedTopic?.topic ? `${selectedTopic.emoji} ${selectedTopic.topic} Mastery Detail` : "Topic Detail"}
            >
                {selectedTopic && (
                    <div className="space-y-8">
                        <div>
                            <h5 className="font-heading font-bold text-sm text-muted uppercase mb-4 tracking-widest">Performance History</h5>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={selectedTopic.sparkline.map((v, i) => ({ session: i + 1, score: v }))}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                        <XAxis dataKey="session" stroke="var(--text-muted)" fontSize={10} />
                                        <YAxis stroke="var(--text-muted)" fontSize={10} domain={[0, 100]} />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                                        <Line type="monotone" dataKey="score" stroke="#00d4ff" strokeWidth={3} dot={{ fill: '#00d4ff' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-surface border border-border">
                                <p className="text-xs text-muted mb-1">Knowledge Coverage</p>
                                <p className="text-xl font-heading font-bold">84%</p>
                            </div>
                            <div className="p-4 rounded-xl bg-surface border border-border">
                                <p className="text-xs text-muted mb-1">Complexity Rating</p>
                                <p className="text-xl font-heading font-bold">Advanced</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-accent-blue bg-opacity-5 border border-accent-blue border-opacity-20">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-5 h-5 text-accent-blue" />
                                <h5 className="font-heading font-bold text-accent-blue">AI Recommendation</h5>
                            </div>
                            <p className="text-sm italic text-muted leading-relaxed">
                                "Based on your recent sessions, we've identified a conceptual gap in {selectedTopic.topic} foundations. Your performance drops during application-heavy questions. We recommend focusing on Active Recall for the next 2 sessions."
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VIEW 4: AI INSIGHTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const AIAnalysisView = ({ insights, onGenerate, loading }) => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="stat-card p-8 bg-surface border border-border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-heading font-bold mb-3 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-accent-purple" />
                            AI Cognitive Analysis
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                            Run a deep scan of your recent study patterns, focus durations, and retention rates to uncover hidden cognitive trends.
                        </p>
                    </div>
                    <button
                        onClick={onGenerate}
                        disabled={loading}
                        className="px-8 py-4 bg-accent-blue text-white font-bold rounded-2xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-blue/20 disabled:opacity-50 whitespace-nowrap"
                    >
                        {loading ? 'Deep Analyzing...' : 'Analyze My Progress'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <>
                        <div className="h-48 bg-surface animate-pulse rounded-[24px]"></div>
                        <div className="h-48 bg-surface animate-pulse rounded-[24px]"></div>
                    </>
                ) : (
                    <>
                        {insights.length > 0 ? (
                            insights.map((insight, i) => (
                                <InsightCard key={i} index={i} insight={insight} />
                            ))
                        ) : (
                            <div className="md:col-span-2 p-20 text-center border-2 border-dashed border-border rounded-[32px] bg-surface/30">
                                <Brain className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                                <h4 className="text-xl font-heading font-bold mb-2">Ready for Analysis</h4>
                                <p className="text-muted max-w-md mx-auto italic">Click the button above to start your first cognitive pattern discovery session.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const QuizView = ({ selectedWeek }) => {
    const [currentStep, setCurrentStep] = useState('intro'); // intro, quiz, result
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showCorrection, setShowCorrection] = useState(false);

    // Reset quiz when week changes
    useEffect(() => {
        setCurrentStep('intro');
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowCorrection(false);
    }, [selectedWeek]);

    const QUIZ_DATA_MAP = {
        week1: {
            title: "Week 1 Assessment",
            description: "Validate your knowledge across Science, Math, History, and Geography.",
            questions: [
                {
                    subject: "Science – Crop Production",
                    question: "Which of the following is a Kharif crop?",
                    options: ["Wheat", "Gram", "Paddy", "Mustard"],
                    answer: "Paddy"
                },
                {
                    subject: "Mathematics – Linear Equations",
                    question: "The solution of the equation 3x – 7 = 11 is:",
                    options: ["4", "5", "6", "7"],
                    answer: "6"
                },
                {
                    subject: "Social Science (History) – Colonial Rule",
                    question: "Who was the Governor-General of India during the Revolt of 1857?",
                    options: ["Lord Dalhousie", "Lord Canning", "Lord Curzon", "Lord Wellesley"],
                    answer: "Lord Canning"
                },
                {
                    subject: "Science – Metals and Non-metals",
                    question: "Which of the following is a non-metal?",
                    options: ["Iron", "Copper", "Sulphur", "Aluminium"],
                    answer: "Sulphur"
                },
                {
                    subject: "Geography – Resources",
                    question: "Which of the following is a renewable resource?",
                    options: ["Coal", "Petroleum", "Natural Gas", "Solar Energy"],
                    answer: "Solar Energy"
                }
            ]
        },
        week2: {
            title: "Week 2 Assessment",
            description: "Deep dive into Microorganisms, Civics, Force, and Agriculture.",
            questions: [
                {
                    subject: "Science – Microorganisms",
                    question: "Which of the following microorganisms is used in the production of curd?",
                    options: ["Yeast", "Lactobacillus", "Rhizobium", "Plasmodium"],
                    answer: "Lactobacillus"
                },
                {
                    subject: "Mathematics – Linear Equations",
                    question: "If (3x - 7)/2 + (x + 5)/2 = x + 6, then the value of x is:",
                    options: ["10", "11", "12", "13"],
                    answer: "12"
                },
                {
                    subject: "Social Science (Civics) – Indian Constitution",
                    question: "Which of the following is a Fundamental Right in India?",
                    options: ["Right to Property", "Right to Vote", "Right to Freedom", "Right to Work"],
                    answer: "Right to Freedom"
                },
                {
                    subject: "Science – Force and Pressure",
                    question: "The SI unit of pressure is:",
                    options: ["Newton", "Joule", "Pascal", "Watt"],
                    answer: "Pascal"
                },
                {
                    subject: "Geography – Agriculture",
                    question: "Which type of farming is mainly practised in areas with high population density?",
                    options: ["Shifting cultivation", "Subsistence farming", "Plantation farming", "Commercial farming"],
                    answer: "Subsistence farming"
                }
            ]
        }
    };

    const currentQuiz = QUIZ_DATA_MAP[selectedWeek].questions;

    const handleAnswer = (option) => {
        if (showCorrection) return;
        setSelectedAnswer(option);
        setShowCorrection(true);
        if (option === currentQuiz[currentQuestion].answer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < currentQuiz.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowCorrection(false);
        } else {
            setCurrentStep('result');
        }
    };

    if (currentStep === 'intro') {
        const quizInfo = QUIZ_DATA_MAP[selectedWeek];
        return (
            <div className="flex flex-col min-h-full bg-background animate-fade-in">
                {/* Header Section */}
                <div className="p-8 border-b border-border bg-surface">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-accent-blue" />
                        </div>
                        <span className="px-3 py-1 bg-accent-purple/10 text-accent-purple text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                            Cognitive Assessment
                        </span>
                    </div>
                    <h1 className="text-4xl font-heading font-extrabold tracking-tight">{quizInfo.title}</h1>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-12">
                    <div className="max-w-3xl space-y-6">
                        <p className="text-2xl text-muted leading-relaxed font-medium capitalize">
                            {quizInfo.description}
                        </p>
                        <p className="text-base text-muted/60 max-w-xl mx-auto">
                            This assessment will validate your retention of core concepts from the past week.
                            Ensure you are in a distraction-free environment before proceeding.
                        </p>
                    </div>

                    <button
                        onClick={() => setCurrentStep('quiz')}
                        className="px-16 py-5 bg-accent-blue text-white font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent-blue/30 flex items-center gap-3 text-xl group"
                    >
                        Start {selectedWeek === 'week1' ? 'Week 1' : 'Week 2'} Test
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
                        {[
                            { label: 'Total Questions', value: quizInfo.questions.length, icon: Calendar, color: 'text-accent-blue' },
                            { label: 'Time Limit', value: '8 Minutes', icon: Clock, color: 'text-accent-purple' },
                            { label: 'Potential Award', value: `+${quizInfo.questions.length * 50} XP`, icon: Award, color: 'text-accent-amber' }
                        ].map((stat, i) => (
                            <div key={i} className="p-8 rounded-[32px] bg-surface border border-border flex flex-col items-center text-center space-y-3 hover:border-accent-blue transition-colors group">
                                <div className={`w-12 h-12 rounded-2xl bg-background flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{stat.label}</p>
                                    <p className="text-2xl font-black">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (currentStep === 'result') {
        const accuracy = Math.round((score / currentQuiz.length) * 100);
        return (
            <div className="flex flex-col min-h-full bg-background animate-fade-in">
                {/* Header Section */}
                <div className="p-8 border-b border-border bg-surface flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 bg-accent-green/10 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-accent-green" />
                            </div>
                            <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                Assessment Finalized
                            </span>
                        </div>
                        <h1 className="text-4xl font-heading font-extrabold tracking-tight">{selectedWeek === 'week1' ? 'Week 1' : 'Week 2'} Performance Summary</h1>
                    </div>
                </div>

                {/* Dashboard Grid Area */}
                <div className="flex-1 p-12 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                            {/* Score Radial */}
                            <div className="lg:col-span-1 flex flex-col items-center text-center space-y-6">
                                <div className="w-64 h-64 relative flex items-center justify-center shadow-premium-dark rounded-full">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="128" cy="128" r="120" stroke="var(--border)" strokeWidth="16" fill="transparent" />
                                        <circle cx="128" cy="128" r="120" stroke="#10b981" strokeWidth="16" strokeDasharray={754} strokeDashoffset={754 - (accuracy / 100) * 754} strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-6xl font-black tracking-tighter">{accuracy}%</span>
                                        <span className="text-xs font-bold text-muted uppercase tracking-widest mt-1">Accuracy</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-heading font-extrabold">Cognitive Breakthrough!</h3>
                                    <p className="text-muted text-lg">Your retention score is in the top 15% of peers.</p>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-10 rounded-[40px] bg-surface border border-border flex flex-col justify-between hover:border-accent-blue transition-colors group">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-1">Success Metric</p>
                                            <p className="text-4xl font-black">{score} / {currentQuiz.length} Correct</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted/80 mt-6 leading-relaxed">
                                        Your neural pathing for this week's topics shows significant stabilization. Keep refining your patterns.
                                    </p>
                                </div>
                                <div className="p-10 rounded-[40px] bg-surface border border-border flex flex-col justify-between hover:border-accent-purple transition-colors group">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-accent-purple group-hover:scale-110 transition-transform">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-1">Experience Gained</p>
                                            <p className="text-4xl font-black text-accent-purple">+{score * 50} XP</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted/80 mt-6 leading-relaxed">
                                        These credits have been added to your baseline intelligence score. You are {10000 - 4250 - (score * 50)} XP from Level 8.
                                    </p>
                                </div>

                                <div className="p-10 rounded-[40px] bg-surface border border-border md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl bg-accent-amber/10 flex items-center justify-center text-accent-amber">
                                            <TrendingUp className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-1">Peak Performance</p>
                                            <p className="text-2xl font-black">Velocity Optimized</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <button
                                            onClick={() => {
                                                setCurrentStep('intro');
                                                setCurrentQuestion(0);
                                                setScore(0);
                                                setSelectedAnswer(null);
                                                setShowCorrection(false);
                                            }}
                                            className="flex-1 md:flex-none px-10 py-5 bg-background border border-border font-bold rounded-2xl hover:bg-surface transition-all active:scale-95"
                                        >
                                            Retry Assessment
                                        </button>
                                        <button className="flex-1 md:flex-none px-12 py-5 bg-accent-blue text-white font-black rounded-2xl hover:scale-105 hover:bg-accent-blue/90 transition-all shadow-xl shadow-accent-blue/20 active:scale-95">
                                            Next Module
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const q = currentQuiz[currentQuestion];
    return (
        <div className="h-full flex flex-col bg-background animate-fade-in">
            <div className="p-8 border-b border-border bg-surface flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center font-bold text-accent-blue text-xl">
                        {currentQuestion + 1}
                    </span>
                    <div>
                        <p className="text-xs font-bold text-accent-blue uppercase tracking-[0.2em]">{q.subject}</p>
                        <p className="text-sm text-muted font-medium">Question {currentQuestion + 1} of {currentQuiz.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-muted uppercase mb-1">Session Progress</p>
                        <p className="text-sm font-bold">{Math.round(((currentQuestion) / currentQuiz.length) * 100)}% Complete</p>
                    </div>
                    <div className="h-2 w-48 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-accent-blue transition-all duration-700" style={{ width: `${((currentQuestion + 1) / currentQuiz.length) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 flex items-center justify-center">
                <div className="w-full max-w-5xl space-y-12">
                    <h4 className="text-4xl lg:text-5xl font-heading font-extrabold text-center leading-[1.15] tracking-tight">{q.question}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {q.options.map((option, i) => {
                            let style = "bg-surface border-border text-foreground hover:border-accent-blue hover:shadow-xl hover:-translate-y-1";
                            if (showCorrection) {
                                if (option === q.answer) style = "bg-accent-green/10 border-accent-green text-accent-green shadow-lg shadow-accent-green/10";
                                else if (option === selectedAnswer) style = "bg-danger/10 border-danger text-danger shadow-lg shadow-danger/10";
                                else style = "opacity-40 border-border grayscale";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(option)}
                                    disabled={showCorrection}
                                    className={`group p-8 rounded-[32px] border-2 text-left transition-all duration-300 flex items-center justify-between min-h-[120px] ${style}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors ${showCorrection && option === q.answer ? 'border-accent-green bg-accent-green text-white' : 'border-border group-hover:border-accent-blue'
                                            }`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="text-xl font-bold">{option}</span>
                                    </div>
                                    {showCorrection && option === q.answer && <CheckCircle2 className="w-8 h-8 text-accent-green animate-in zoom-in-50 duration-300" />}
                                    {showCorrection && option === selectedAnswer && option !== q.answer && <AlertCircle className="w-8 h-8 text-danger animate-shake" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-8 bg-surface border-t border-border flex justify-between items-center">
                <p className="text-sm text-muted font-medium italic">Select one option to reveal the cognitive validation.</p>
                {showCorrection && (
                    <button
                        onClick={nextQuestion}
                        className="flex items-center gap-3 px-10 py-4 bg-accent-blue text-white font-black rounded-2xl hover:bg-accent-blue/90 transition-all shadow-xl shadow-accent-blue/20 active:scale-95"
                    >
                        {currentQuestion === currentQuiz.length - 1 ? 'Unlock Analysis' : 'Next Question'} <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

const AIInsightsView = ({ messages, onSend, input, setInput, chatEndRef }) => {
    return (
        <div className="w-full h-full flex flex-col bg-background">
            <div className="p-6 lg:px-12 border-b border-border flex items-center justify-between bg-surface sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-accent-purple" />
                    </div>
                    <div>
                        <h4 className="font-heading font-bold text-lg">Learning Coach Consultation</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider">AI Expert Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-6 custom-scrollbar bg-background">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[80%] lg:max-w-[60%] p-6 rounded-3xl text-sm md:text-base leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-accent-blue text-white rounded-tr-none'
                            : 'bg-surface border border-border text-foreground rounded-tl-none font-medium'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="p-6 lg:px-12 lg:py-8 bg-surface border-t border-border">
                <div className="relative w-full">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && onSend()}
                        type="text"
                        placeholder="Ask me anything about your learning journey..."
                        className="w-full bg-background border border-border rounded-[24px] px-8 py-6 pr-20 focus:outline-none focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all text-sm shadow-inner"
                    />
                    <button
                        onClick={onSend}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 bg-accent-blue text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-blue/20"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-muted mt-4 font-bold uppercase tracking-widest opacity-60">
                    Always Online • Powered by Advanced Cognitive Intelligence
                </p>
            </div>
        </div>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VIEW 5: STUDY SESSION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const StudySessionView = () => {
    const [status, setStatus] = useState('setup'); // setup, active, summary
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [focusScore, setFocusScore] = useState(85);
    const [events, setEvents] = useState([]);
    const [quizOpen, setQuizOpen] = useState(false);

    // AI Tracking
    const videoRef = useRef(null);
    const [streamReady, setStreamReady] = useState(false);
    const [model, setModel] = useState(null);
    const [faceAlert, setFaceAlert] = useState(false);
    const faceAlertRef = useRef(false);

    useEffect(() => {
        const loadBlazeface = async () => {
            try {
                await tf.setBackend('webgl');
                console.log("WebGL backend initialized");
                const loaded = await blazeface.load();
                setModel(loaded);
                console.log("BlazeFace model loaded successfully");
            } catch (e) {
                console.error("Failed to load blazeface", e);
            }
        };
        loadBlazeface();
        return () => stopCamera();
    }, []);

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        let faceInterval = null;
        if (status === 'active' && model && streamReady && videoRef.current) {
            faceInterval = setInterval(async () => {
                if (!videoRef.current || !videoRef.current.srcObject) return;

                try {
                    const predictions = await model.estimateFaces(videoRef.current, false);
                    const faceFound = predictions.length > 0;

                    if (!faceFound) {
                        if (!faceAlertRef.current) {
                            faceAlertRef.current = true;
                            setFaceAlert(true);
                            setIsActive(false);
                            setEvents(prev => [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg: "User absent. Session paused.", type: 'low' }, ...prev.slice(0, 4)]);
                        }
                    } else {
                        if (faceAlertRef.current) {
                            faceAlertRef.current = false;
                            setFaceAlert(false);
                            setQuizOpen(currentQuizOpen => {
                                if (!currentQuizOpen) {
                                    setIsActive(true);
                                }
                                return currentQuizOpen;
                            });
                            setEvents(prev => [{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg: "User returned. Resuming.", type: 'focus' }, ...prev.slice(0, 4)]);
                        }
                    }
                } catch (e) {
                    // Ignore transient errors
                }
            }, 1000);
        }
        return () => clearInterval(faceInterval);
    }, [status, model, streamReady]);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);

                // Simulate focus fluctuation
                setFocusScore(prev => {
                    const delta = (Math.random() - 0.5) * 4;
                    return Math.min(100, Math.max(30, prev + delta));
                });

                // Random focus events
                if (Math.random() > 0.98) {
                    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const isFocus = Math.random() > 0.3;
                    setEvents(prev => [{
                        time: timeStr,
                        msg: isFocus ? "Deep focus detected" : "Distraction potential high",
                        type: isFocus ? 'focus' : 'low'
                    }, ...prev.slice(0, 4)]);
                }

                // Quiz pop (every 30 seconds for demo)
                if (seconds > 0 && seconds % 30 === 0) {
                    setQuizOpen(true);
                    setIsActive(false);
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const formatTime = (s) => {
        const hrs = Math.floor(s / 3600);
        const mins = Math.floor((s % 3600) / 60);
        const secs = s % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startSession = async () => {
        setStatus('active');
        setIsActive(true);
        setSeconds(0);
        setFaceAlert(false);
        faceAlertRef.current = false;
        setStreamReady(false);
        setEvents([{ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), msg: "Session started. Cognitive AI active.", type: 'focus' }]);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.log("Camera access denied or unavailable", err);
        }
    };

    const endSession = () => {
        setIsActive(false);
        setStatus('summary');
        setStreamReady(false);
        stopCamera();
    };

    return (
        <>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                width="320"
                height="240"
                className="opacity-0 pointer-events-none absolute -z-50"
                onLoadedData={() => setStreamReady(true)}
            />

            {status === 'setup' && (
                <div className="w-full h-full p-8 lg:p-12 bg-background flex flex-col animate-fade-in overflow-y-auto">
                    <div className="mb-10 lg:mt-8">
                        <h3 className="text-4xl font-heading font-bold mb-3">Initialize Study Session</h3>
                        <p className="text-muted text-lg">Set your parameters to begin optimized tracking</p>
                    </div>

                    <div className="space-y-8 max-w-4xl">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Select Topic</label>
                            <select className="w-full bg-surface border border-border rounded-2xl p-5 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all cursor-pointer">
                                {MOCK_TOPICS.map(t => <option key={t.id}>{t.emoji} {t.topic}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Session Goal</label>
                            <input className="w-full bg-surface border border-border rounded-2xl p-5 focus:border-accent-blue focus:ring-4 focus:ring-accent-blue/10 transition-all" placeholder="e.g. Master Neural Networks basics" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Intensity Level</label>
                            <div className="grid grid-cols-3 gap-6">
                                {['Moderate', 'Deep Work', 'Sprint'].map(d => (
                                    <button key={d} className={`p-5 rounded-2xl border font-bold hover:border-accent-blue transition-all ${d === 'Deep Work' ? 'bg-accent-blue/10 border-accent-blue text-accent-blue' : 'bg-surface border-border text-foreground hover:bg-surface/80'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border">
                            <button
                                onClick={startSession}
                                className="w-full md:w-auto px-16 py-6 bg-accent-blue text-white font-extrabold rounded-2xl text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-blue/20"
                            >
                                Start Session
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {status === 'active' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full min-h-full p-8 lg:p-12 bg-background relative overflow-y-auto">

                    {faceAlert && (
                        <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                            <div className="w-24 h-24 rounded-full bg-danger/10 flex items-center justify-center mb-6 animate-pulse">
                                <CameraOff className="w-10 h-10 text-danger" />
                            </div>
                            <h3 className="text-4xl font-heading font-black text-danger mb-4 tracking-tight">Focus Lost</h3>
                            <p className="text-lg text-muted max-w-md">We lost sight of you in the camera frame. Visual presence is required to track focus metrics.</p>
                            <p className="text-sm text-foreground font-bold mt-8 animate-pulse uppercase tracking-widest">Return to the frame to automatically resume...</p>
                        </div>
                    )}

                    <div className="xl:col-span-2 space-y-8">
                        <div className="p-12 rounded-[40px] border border-border bg-surface flex flex-col items-center justify-center text-center relative overflow-hidden h-[500px] shadow-sm">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-background">
                                <div
                                    className="h-full bg-accent-blue transition-all duration-1000 ease-linear"
                                    style={{ width: `${(seconds % 60) * 1.66}%` }}
                                ></div>
                            </div>
                            <h2 className="text-[120px] font-heading font-black mb-12 tracking-tighter text-foreground leading-none">{formatTime(seconds)}</h2>
                            <div className="flex gap-6">
                                <button onClick={() => setIsActive(!isActive)} className="px-10 py-5 rounded-3xl bg-background border-2 border-border text-foreground font-bold hover:bg-surface hover:border-accent-blue hover:text-accent-blue transition-all flex items-center gap-3">
                                    {isActive ? <><Pause className="w-6 h-6" /> Pause</> : <><Play className="w-6 h-6" /> Resume</>}
                                </button>
                                <button onClick={endSession} className="px-10 py-5 rounded-3xl bg-danger/10 border-2 border-danger/30 text-danger font-bold hover:bg-danger hover:border-danger hover:text-white transition-all flex items-center gap-3">
                                    <Square className="w-6 h-6" /> End
                                </button>
                            </div>
                        </div>

                        <div className="p-10 rounded-[32px] border border-border bg-surface shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="font-heading font-bold text-xl">Live Focus Meter</h4>
                                <span className="text-3xl font-black text-accent-blue">{Math.floor(focusScore)}%</span>
                            </div>
                            <div className="h-8 w-full bg-background rounded-full overflow-hidden border border-border p-1">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full bg-gradient-to-r ${focusScore > 70 ? 'from-accent-blue to-accent-green' : focusScore > 40 ? 'from-accent-amber to-accent-blue' : 'from-danger to-accent-amber'}`}
                                    style={{ width: `${focusScore}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="p-10 rounded-[32px] border border-border bg-surface h-[500px] flex flex-col shadow-sm">
                            <h4 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
                                <History className="w-5 h-5 text-accent-blue" /> Session Log
                            </h4>
                            <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                                {events.map((e, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-background border border-border animate-fade-in flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${e.type === 'focus' ? 'bg-accent-green text-accent-green' : 'bg-danger text-danger'}`} />
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{e.msg}</p>
                                            <p className="text-[10px] text-muted font-medium mt-1 uppercase">{e.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 rounded-[32px] bg-accent-purple/10 border border-accent-purple/20 shadow-sm">
                            <p className="text-xs font-bold text-accent-purple uppercase tracking-[0.2em] mb-4">XR Progress</p>
                            <div className="flex items-center gap-4">
                                <h3 className="text-4xl font-black text-accent-purple">+{Math.floor(seconds / 60) * 10} XP</h3>
                                <Award className="w-8 h-8 text-accent-purple opacity-50" />
                            </div>
                        </div>
                    </div>

                    <Modal isOpen={quizOpen} onClose={() => { setQuizOpen(false); setIsActive(true) }} title="Comprehension Check">
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-accent-blue bg-opacity-5 border border-accent-blue border-opacity-20">
                                <p className="font-bold text-lg mb-4">How does the Transformers architecture handle sequential data?</p>
                                <div className="space-y-3">
                                    {[
                                        "Recurrent Feedback Loops",
                                        "Self-Attention Mechanism",
                                        "Convolutional Sliding Windows",
                                        "Stochastic Gradient Descent"
                                    ].map((choice, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setQuizOpen(false); setIsActive(true) }}
                                            className="w-full p-4 rounded-xl bg-surface border border-border hover:border-accent-blue text-left transition-all"
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            )}

            {status === 'summary' && (
                <div className="w-full min-h-full p-8 lg:p-12 bg-background space-y-12 animate-fade-in overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="flex items-center gap-6 pb-8 border-b border-border">
                            <div className="w-20 h-20 bg-accent-green/10 rounded-3xl flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-accent-green" />
                            </div>
                            <div>
                                <h2 className="text-5xl font-heading font-black text-foreground">Session Complete!</h2>
                                <p className="text-lg text-muted mt-2">Amazing work. Your cognitive patterns are stabilizing.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-8 bg-surface rounded-[32px] border border-border hover:border-accent-blue transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Timer className="w-6 h-6 text-foreground" />
                                </div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Total Time</p>
                                <p className="text-4xl font-black font-heading">{formatTime(seconds)}</p>
                            </div>
                            <div className="p-8 bg-surface rounded-[32px] border border-border hover:border-accent-green transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Brain className="w-6 h-6 text-accent-green" />
                                </div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Avg Focus</p>
                                <p className="text-4xl font-black font-heading text-accent-green">88%</p>
                            </div>
                            <div className="p-8 bg-surface rounded-[32px] border border-border hover:border-accent-purple transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Award className="w-6 h-6 text-accent-purple" />
                                </div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">XP Earned</p>
                                <p className="text-4xl font-black font-heading text-accent-purple">+{Math.floor(seconds / 60) * 10} XP</p>
                            </div>
                            <div className="p-8 bg-surface rounded-[32px] border border-border hover:border-accent-blue transition-colors group">
                                <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-accent-blue" />
                                </div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Pattern</p>
                                <p className="text-3xl font-black font-heading text-accent-blue">Deep Flow</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button className="flex-1 py-6 bg-accent-blue text-white font-extrabold rounded-2xl text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-blue/20">
                                <Sparkles className="w-6 h-6" /> Get AI Session Analysis
                            </button>
                            <button onClick={() => setStatus('setup')} className="flex-1 py-6 bg-surface text-foreground font-extrabold rounded-2xl text-xl border border-border hover:bg-background transition-all active:scale-95">
                                Start Another Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN APPLICATION
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SidebarItem = ({ id, label, icon: Icon, active, onClick, hasSubItems, isOpen, onToggle, children }) => (
    <div className="w-full">
        <button
            onClick={() => {
                if (hasSubItems) onToggle();
                else onClick(id);
            }}
            className={`w-full flex items-center justify-between px-6 py-4 transition-all relative group ${active ? 'text-accent-blue' : 'text-muted hover:text-text'
                }`}
        >
            <div className="flex items-center gap-4">
                {active && !hasSubItems && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
                )}
                <Icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_5px_rgba(0,212,255,0.5)]' : ''}`} />
                <span className="font-bold text-sm tracking-wide lg:block hidden">{label}</span>
            </div>
            {hasSubItems && (
                <ChevronRight className={`w-4 h-4 transition-transform lg:block hidden ${isOpen ? 'rotate-90' : ''}`} />
            )}
        </button>
        {hasSubItems && isOpen && (
            <div className="ml-12 mt-1 space-y-1 lg:block hidden">
                {children}
            </div>
        )}
    </div>
);

export default function DashboardApp({ onLogout }) {
    const [activeView, setActiveView] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isQuizMenuOpen, setIsQuizMenuOpen] = useState(true);
    const [selectedWeek, setSelectedWeek] = useState('week1');

    // AI Shared States
    const [insights, setInsights] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm your Cognitive Learning Coach. I've been monitoring your learning patterns. Ready to optimize your study sessions?" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef(null);

    const generateInsights = async () => {
        setIsAnalyzing(true);
        try {
            const response = await callClaude("JSON Analysis System", "Analyze mock learner data for insights");
            const data = JSON.parse(response.content[0].text);
            setInsights(data);
            setMessages(prev => [...prev, { role: 'assistant', text: "I've just finished analyzing your patterns. Check out the AI Analysis tab for the latest results!" }]);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCoachSend = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        const coachResponse = await callClaude("Chat Coach", userMsg);
        setMessages(prev => [...prev, { role: 'assistant', text: coachResponse.content[0].text }]);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const VIEWS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: <DashboardView /> },
        { id: 'mastery', label: 'Mastery', icon: BookOpen, component: <TopicMasteryView /> },
        { id: 'ai-analysis', label: 'AI Analysis', icon: Brain, component: <AIAnalysisView insights={insights} onGenerate={generateInsights} loading={isAnalyzing} /> },
        { id: 'patterns', label: 'Patterns', icon: History, component: <LearningPatternsView /> },
        { id: 'insights', label: 'Learning Coach', icon: Sparkles, component: <AIInsightsView messages={messages} onSend={handleCoachSend} input={chatInput} setInput={setChatInput} chatEndRef={chatEndRef} /> },
        { id: 'session', label: 'Study Session', icon: Timer, component: <StudySessionView /> },
        { id: 'quiz', label: 'Quiz', icon: Zap, component: <QuizView selectedWeek={selectedWeek} /> },
    ];

    const isFullWidthView = activeView.startsWith('quiz') || activeView === 'insights' || activeView === 'session';
    const currentView = VIEWS.find(v => v.id === (activeView.startsWith('quiz') ? 'quiz' : activeView));

    return (
        <div className="app-premium">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className={`transition-all duration-500 bg-surface border-r border-border flex flex-col ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent-blue/20">
                            <Brain className="w-6 h-6" />
                        </div>
                        {!isSidebarCollapsed && (
                            <span className="font-heading font-bold text-xl tracking-tight">cogno</span>
                        )}
                    </div>

                    <nav className="flex-1 space-y-2 px-3 overflow-y-auto custom-scrollbar">
                        {VIEWS.map(view => {
                            if (view.id === 'quiz') {
                                return (
                                    <SidebarItem
                                        key={view.id}
                                        id={view.id}
                                        label={view.label}
                                        icon={view.icon}
                                        active={activeView.startsWith('quiz')}
                                        hasSubItems={true}
                                        isOpen={isQuizMenuOpen}
                                        onToggle={() => setIsQuizMenuOpen(!isQuizMenuOpen)}
                                        onClick={setActiveView}
                                    >
                                        <div className="space-y-1">
                                            {['week1', 'week2'].map((week) => (
                                                <button
                                                    key={week}
                                                    onClick={() => {
                                                        setSelectedWeek(week);
                                                        setActiveView(`quiz-${week}`);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeView === `quiz-${week}`
                                                        ? 'bg-accent-blue/10 text-accent-blue border-l-2 border-accent-blue'
                                                        : 'text-muted hover:text-foreground hover:bg-background'
                                                        }`}
                                                >
                                                    Week {week.replace('week', '')}
                                                </button>
                                            ))}
                                        </div>
                                    </SidebarItem>
                                );
                            }
                            return (
                                <SidebarItem
                                    key={view.id}
                                    id={view.id}
                                    label={view.label}
                                    icon={view.icon}
                                    active={activeView === view.id}
                                    onClick={setActiveView}
                                />
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto border-t border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold border-2 border-accent-purple/50">
                                {MOCK_LEARNER.avatar}
                            </div>
                            {!isSidebarCollapsed && (
                                <div className="lg:block hidden">
                                    <p className="text-sm font-bold text-foreground">{MOCK_LEARNER.name}</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-accent-amber text-white rounded uppercase">Lvl {MOCK_LEARNER.level}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!isSidebarCollapsed && (
                            <div className="p-3 bg-background rounded-xl lg:block hidden border border-border">
                                <div className="flex justify-between text-[10px] font-bold text-muted mb-1">
                                    <span>XP PROGRESS</span>
                                    <span>{MOCK_LEARNER.xp}/{MOCK_LEARNER.totalXp}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent-purple animate-pulse"
                                        style={{ width: `${(MOCK_LEARNER.xp / MOCK_LEARNER.totalXp) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        <p className={`mt-4 text-xs font-bold text-accent-amber flex items-center gap-2 ${isSidebarCollapsed ? 'justify-center' : 'lg:justify-start justify-center'}`}>
                            <Flame className="w-4 h-4" /> <span className={`${isSidebarCollapsed ? 'hidden' : 'lg:block hidden'}`}>{MOCK_LEARNER.streak} Day Streak</span>
                        </p>
                        <div className="mt-4 pt-4 border-t border-border">
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-4 px-6 py-3 text-muted hover:text-danger hover:bg-danger/10 transition-all rounded-lg"
                            >
                                <LogOut className="w-5 h-5" />
                                {!isSidebarCollapsed && <span className="font-bold text-sm lg:block hidden">Logout</span>}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 transition-all duration-300 min-h-screen bg-background relative overflow-y-auto">
                    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border p-6 flex justify-between items-center transition-colors">
                        <div>
                            <h2 className="text-2xl font-heading font-bold capitalize text-foreground">{activeView.replace('-', ' ')}</h2>
                            <p className="text-muted text-sm hidden md:block">Welcome back, Alex. Your learning efficiency is up 12% today.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <AnimatedThemeToggler />
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search knowledge..."
                                    className="bg-background border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-blue w-64 text-foreground"
                                />
                            </div>
                            <button className="p-2 rounded-full bg-background border border-border hover:bg-surface transition-all relative">
                                <Zap className="w-5 h-5 text-accent-amber" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full border-2 border-surface"></span>
                            </button>
                        </div>
                    </header>

                    <div className={`${isFullWidthView ? 'p-0 h-[calc(100vh-89px)]' : 'p-6 max-w-[1600px] pb-24 lg:pb-6'} animate-fade-in mx-auto w-full`}>
                        {currentView?.component}
                    </div>

                    {/* Mobile Nav Bar */}
                    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex justify-around items-center lg:hidden z-50">
                        {VIEWS.map(view => (
                            <button
                                key={view.id}
                                onClick={() => setActiveView(view.id)}
                                className={`flex flex-col items-center gap-1 ${activeView === view.id ? 'text-accent-blue' : 'text-muted'}`}
                            >
                                <view.icon className="w-5 h-5" />
                                <span className="text-[10px] font-bold">{view.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </nav>
                </main>
            </div>
        </div>
    );
}
