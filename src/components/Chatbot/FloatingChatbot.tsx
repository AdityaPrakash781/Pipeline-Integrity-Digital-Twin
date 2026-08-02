import { useState, useRef, useEffect } from 'react';
import { usePipelineStore } from '../../store/usePipelineStore';
import { formatPercentage } from '../../utils/colors';

interface Message {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
}

/**
 * Floating Pipeline Query Assistant
 * Clean industrial engineering tool — no sci-fi styling
 */
export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputQuery, setInputQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const segments = usePipelineStore((state) => state.segments);
    const selectedSegmentId = usePipelineStore((state) => state.selectedSegmentId);
    const selectSegment = usePipelineStore((state) => state.selectSegment);

    const segmentArray = Array.from(segments.values());
    const criticalSegments = segmentArray.filter((s) => s.integrity < 0.3);
    const warningSegments = segmentArray.filter((s) => s.integrity >= 0.3 && s.integrity < 0.6);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init-1',
            sender: 'assistant',
            text: `Query assistant ready. Connected to ${segments.size || 10} pipeline segments with live telemetry, external surface scan data, and PINN degradation forecasts.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const generateResponse = (query: string): string => {
        const q = query.toLowerCase();

        const matchedSeg = segmentArray.find((s) => q.includes(s.segment_id.toLowerCase()));
        if (matchedSeg) {
            const extCorrosion = matchedSeg.cv ? `${matchedSeg.cv.corrosion_surface_pct.toFixed(1)}%` : 'N/A';
            const rulDays = matchedSeg.pinn ? `${matchedSeg.pinn.remaining_useful_life_days} days` : 'N/A';
            const statusLabel =
                matchedSeg.integrity < 0.3 ? 'Critical' :
                matchedSeg.integrity < 0.6 ? 'Warning' : 'Normal';

            return `${matchedSeg.segment_id} — ${statusLabel}\n` +
                `Integrity: ${formatPercentage(matchedSeg.integrity)}\n` +
                `External Corrosion: ${extCorrosion}\n` +
                `Remaining Useful Life: ${rulDays}\n` +
                (matchedSeg.cv?.confidence ? `Detection Confidence: ${(matchedSeg.cv.confidence * 100).toFixed(0)}%\n` : '') +
                `Segment selected in 3D view.`;
        }

        if (q.includes('critical') || q.includes('defect') || q.includes('risk') || q.includes('damage') || q.includes('worst')) {
            if (criticalSegments.length === 0) {
                return `No critical segments detected. ${segments.size} segments active, ${warningSegments.length} in warning range.`;
            }
            const listStr = criticalSegments
                .map((s) => `${s.segment_id} (${formatPercentage(s.integrity)}, ${s.pinn?.remaining_useful_life_days || 0} days RUL)`)
                .join('\n');
            return `Critical segments (${criticalSegments.length}):\n${listStr}\n\nRecommendation: Schedule external surface inspection and coating repair.`;
        }

        if (q.includes('pinn') || q.includes('fick') || q.includes('physics') || q.includes('equation') || q.includes('model') || q.includes('rul')) {
            return `Degradation forecast uses Fick's 2nd Law of Diffusion:\n\n  dC/dt = D * d²C/dx²\n\nThe PINN model embeds this physical constraint into its loss function, ensuring predictions respect material transport laws rather than relying purely on statistical fit.`;
        }

        if (q.includes('maintenance') || q.includes('schedule') || q.includes('repair') || q.includes('recommend')) {
            const sortedByRul = [...segmentArray].sort(
                (a, b) => (a.pinn?.remaining_useful_life_days || 999) - (b.pinn?.remaining_useful_life_days || 999)
            );
            const topUrgent = sortedByRul[0];
            return `Maintenance priority:\n1. ${topUrgent?.segment_id || 'SEG-003'} — ${topUrgent?.pinn?.remaining_useful_life_days || 30} days RUL remaining\n2. Segments with external corrosion area > 10% should be scheduled for coating repair.`;
        }

        return `Ready for queries. Examples:\n• "Status of SEG-003"\n• "List critical segments"\n• "Explain the PINN model"\n• "Maintenance priorities"`;
    };

    const handleSend = (textToSend?: string) => {
        const query = (textToSend || inputQuery).trim();
        if (!query) return;

        const userMsg: Message = {
            id: `usr-${Date.now()}`,
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputQuery('');
        setIsTyping(true);

        const matchedSeg = segmentArray.find((s) => query.toLowerCase().includes(s.segment_id.toLowerCase()));
        if (matchedSeg) selectSegment(matchedSeg.segment_id);

        setTimeout(() => {
            const aiMsg: Message = {
                id: `ai-${Date.now()}`,
                sender: 'assistant',
                text: generateResponse(query),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 500);
    };

    const promptPills = [
        'SEG-003 status',
        'Critical segments',
        'PINN model',
        'Maintenance priorities',
    ];

    return (
        <>
            {/* Floating Trigger Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none"
                    style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(180deg, #e4e4e7 0%, #c4c4c8 100%)',
                        border: '1px solid #a1a1aa',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 4px 16px rgba(0,0,0,0.5)',
                    }}
                    title="Pipeline Query Assistant"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl"
                    style={{
                        background: 'linear-gradient(180deg, rgba(42,42,45,0.55) 0%, rgba(15,15,16,0.72) 100%)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.10), 0 16px 48px rgba(0,0,0,0.7)',
                    }}
                >
                    {/* Header */}
                    <div
                        className="px-4 py-3 flex items-center justify-between border-b"
                        style={{
                            background: 'linear-gradient(180deg, #262629 0%, #1a1a1d 100%)',
                            borderColor: '#38383c',
                        }}
                    >
                        <div>
                            <div className="text-xs font-semibold text-zinc-200 tracking-wide">
                                Pipeline Query Assistant
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                {segments.size} segments · PINN + Optical
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setMessages([messages[0]])}
                                className="text-[10px] text-zinc-500 hover:text-zinc-300 px-2 py-0.5 rounded transition-colors border border-transparent hover:border-zinc-700"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-500 hover:text-zinc-300 px-1.5 text-base font-medium transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ scrollbarWidth: 'thin' }}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className="text-[10px] text-zinc-600 font-mono mb-1">
                                    {msg.sender === 'user' ? 'Operator' : 'System'} · {msg.timestamp}
                                </div>
                                <div
                                    className="max-w-[88%] px-3 py-2.5 rounded text-xs leading-relaxed text-zinc-200"
                                    style={msg.sender === 'user' ? {
                                        background: 'linear-gradient(180deg, #2a2a2d 0%, #1c1c1e 100%)',
                                        border: '1px solid #38383c',
                                    } : {
                                        background: 'linear-gradient(180deg, #222224 0%, #171718 100%)',
                                        border: '1px solid #2f2f33',
                                    }}
                                >
                                    {msg.text.split('\n').map((line, idx) => (
                                        <p key={idx} className={idx > 0 ? 'mt-1' : ''}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2 text-zinc-500 text-[11px] pl-1">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                                <span>Processing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Queries */}
                    <div
                        className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t"
                        style={{ borderColor: '#2f2f33' }}
                    >
                        {promptPills.map((pill, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(pill)}
                                className="shrink-0 text-[10px] text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded transition-colors whitespace-nowrap"
                                style={{
                                    background: 'linear-gradient(180deg, #2a2a2d 0%, #1c1c1e 100%)',
                                    border: '1px solid #38383c',
                                }}
                            >
                                {pill}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-3 flex gap-2 items-center border-t"
                        style={{ borderColor: '#2f2f33' }}
                    >
                        <input
                            type="text"
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            placeholder="Query segment, RUL, defects..."
                            className="flex-1 text-xs text-zinc-100 placeholder-zinc-600 outline-none rounded px-3 py-2 transition-colors"
                            style={{
                                background: '#0f0f10',
                                border: '1px solid #38383c',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!inputQuery.trim()}
                            className="px-3 py-2 rounded text-xs font-medium transition-all disabled:opacity-30 text-zinc-300 hover:text-zinc-100"
                            style={{
                                background: 'linear-gradient(180deg, #2a2a2d 0%, #1c1c1e 100%)',
                                border: '1px solid #38383c',
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
