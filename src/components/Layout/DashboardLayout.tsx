import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PipelineScene from '../DigitalTwin/PipelineScene';
import CVInspectionPanel from '../CVPanel/CVInspectionPanel';
import AnalyticsPanel from '../Analytics/AnalyticsPanel';
import XAIPanel from '../XAI/XAIPanel';
import FloatingChatbot from '../Chatbot/FloatingChatbot';

/**
 * Main dashboard layout with grid-based responsive design
 */
export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState<'analytics' | 'xai'>('analytics');

    return (
        <div className="h-screen flex flex-col bg-industrial-950 relative">
            <Header />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 grid-rows-2 gap-4 p-4 overflow-hidden bg-industrial-950">
                    {/* 3D Digital Twin - Left side, full height */}
                    <div className="lg:col-span-3 row-span-2 rounded-lg overflow-hidden shadow-2xl border border-industrial-700">
                        <PipelineScene />
                    </div>

                    {/* External Damage Inspection Panel - Top right */}
                    <div className="lg:col-span-2 row-span-1 overflow-hidden">
                        <CVInspectionPanel />
                    </div>

                    {/* Analytics/XAI Panel - Bottom right with tabs */}
                    <div className="lg:col-span-2 row-span-1 overflow-hidden flex flex-col">
                        {/* Tab selector */}
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className="flex-1 px-4 py-2 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-200"
                                style={activeTab === 'analytics' ? {
                                    background: 'linear-gradient(180deg, #e4e4e7 0%, #c4c4c8 100%)',
                                    border: '1px solid #a1a1aa',
                                    color: '#18181b',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.4)',
                                } : {
                                    background: 'linear-gradient(180deg, #2a2a2d 0%, #1c1c1e 100%)',
                                    border: '1px solid #38383c',
                                    color: '#71717a',
                                }}
                            >
                                Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('xai')}
                                className="flex-1 px-4 py-2 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-200"
                                style={activeTab === 'xai' ? {
                                    background: 'linear-gradient(180deg, #e4e4e7 0%, #c4c4c8 100%)',
                                    border: '1px solid #a1a1aa',
                                    color: '#18181b',
                                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.4)',
                                } : {
                                    background: 'linear-gradient(180deg, #2a2a2d 0%, #1c1c1e 100%)',
                                    border: '1px solid #38383c',
                                    color: '#71717a',
                                }}
                            >
                                XAI Diagnostics
                            </button>
                        </div>

                        {/* Tab content */}
                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'analytics' ? <AnalyticsPanel /> : <XAIPanel />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chatbot Bubble at Bottom Right */}
            <FloatingChatbot />
        </div>
    );
}
