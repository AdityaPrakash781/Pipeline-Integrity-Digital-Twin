import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PipelineScene from '../DigitalTwin/PipelineScene';
import CVInspectionPanel from '../CVPanel/CVInspectionPanel';
import AnalyticsPanel from '../Analytics/AnalyticsPanel';
import XAIPanel from '../XAI/XAIPanel';

/**
 * Main dashboard layout with grid-based responsive design
 */
export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState<'analytics' | 'xai'>('analytics');

    return (
        <div className="h-screen flex flex-col bg-industrial-900">
            <Header />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 grid-rows-2 gap-4 p-4 overflow-hidden">
                    {/* 3D Digital Twin - Left side, full height */}
                    <div className="lg:col-span-3 row-span-2 rounded-lg overflow-hidden shadow-2xl border border-industrial-700">
                        <PipelineScene />
                    </div>

                    {/* CV Inspection Panel - Top right */}
                    <div className="lg:col-span-2 row-span-1 overflow-hidden">
                        <CVInspectionPanel />
                    </div>

                    {/* Analytics/XAI Panel - Bottom right with tabs */}
                    <div className="lg:col-span-2 row-span-1 overflow-hidden flex flex-col">
                        {/* Tab selector */}
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analytics'
                                        ? 'bg-industrial-800 text-healthy border border-industrial-700'
                                        : 'bg-industrial-800/50 text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('xai')}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'xai'
                                        ? 'bg-industrial-800 text-healthy border border-industrial-700'
                                        : 'bg-industrial-800/50 text-slate-400 hover:text-slate-300'
                                    }`}
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
        </div>
    );
}
