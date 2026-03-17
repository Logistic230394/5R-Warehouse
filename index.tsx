
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

import { AuditSession, AuditCategory } from './types';
import { KRITERIA_5R, INITIAL_PLACEHOLDERS } from './constants';
import { generateId } from './utils';

import DottedGlowBackground from './components/DottedGlowBackground';
import SideDrawer from './components/SideDrawer';
import RadarChart from './components/RadarChart';
import { 
    ThinkingIcon, 
    SparklesIcon, 
    ArrowUpIcon, 
    GridIcon,
    CodeIcon
} from './components/Icons';

function App() {
  const [view, setView] = useState<'welcome' | 'form' | 'results'>('welcome');
  const [auditorName, setAuditorName] = useState('');
  const [auditArea, setAuditArea] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number[]>>({});
  const [sessions, setSessions] = useState<AuditSession[]>([]);
  const [currentSession, setCurrentSession] = useState<AuditSession | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const startAudit = () => {
    if (!auditorName || !auditArea) return;
    const initialScores: Record<string, number[]> = {};
    KRITERIA_5R.forEach(cat => {
        initialScores[cat.name] = cat.questions.map(() => 3);
    });
    setScores(initialScores);
    setView('form');
    setCurrentStep(0);
  };

  const handleScoreChange = (category: string, questionIndex: number, value: number) => {
    setScores(prev => ({
        ...prev,
        [category]: prev[category].map((s, i) => i === questionIndex ? value : s)
    }));
  };

  const calculateResults = async () => {
    setIsLoading(true);
    const categoryAverages: Record<string, number> = {};
    let totalSum = 0;
    
    KRITERIA_5R.forEach(cat => {
        const avg = scores[cat.name].reduce((a, b) => a + b, 0) / cat.questions.length;
        categoryAverages[cat.name] = avg;
        totalSum += avg;
    });

    const totalAverage = totalSum / KRITERIA_5R.length;

    const newSession: AuditSession = {
        id: generateId(),
        auditor: auditorName,
        area: auditArea,
        date: new Date().toLocaleDateString(),
        scores: scores,
        averages: categoryAverages,
        totalAverage: totalAverage,
        timestamp: Date.now()
    };

    setCurrentSession(newSession);
    setView('results');

    // Generate AI Insights
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) return;
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
Analyze these 5R Audit results for the area: "${auditArea}".
Auditor: ${auditorName}
Scores (1-5 scale):
${Object.entries(categoryAverages).map(([k, v]) => `- ${k}: ${v.toFixed(2)}`).join('\n')}

**Task:**
1. Provide a concise overall summary of the warehouse's 5R health.
2. Identify the weakest "R" and suggest 3 specific Kaizen (continuous improvement) actions to fix it.
3. Highlight one strength found.
4. Keep the tone professional, encouraging, and actionable.
Format as clean Markdown.
        `.trim();

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        const insights = response.text || "Unable to generate insights at this time.";
        const updatedSession = { ...newSession, aiInsights: insights };
        setCurrentSession(updatedSession);
        setSessions(prev => [updatedSession, ...prev]);
    } catch (e) {
        console.error("AI Insights failed", e);
    } finally {
        setIsLoading(false);
    }
  };

  const downloadReport = () => {
    if (!currentSession) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentSession, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `audit_${currentSession.area}_${currentSession.date}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <>
        <div className="immersive-app">
            <DottedGlowBackground 
                gap={24} 
                radius={1.5} 
                color="rgba(255, 255, 255, 0.02)" 
                glowColor="rgba(255, 255, 255, 0.1)" 
                speedScale={0.3} 
            />

            {view === 'welcome' && (
                <div className="audit-stage center-flex">
                    <div className="hero-content">
                        <div className="badge">5R COMPLIANCE</div>
                        <h1>5R Internal Audit</h1>
                        <p>Warehouse RM Technical & FG Herbisida</p>
                        
                        <div className="audit-setup-card">
                            <div className="input-group">
                                <label>Auditor Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    value={auditorName} 
                                    onChange={(e) => setAuditorName(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label>Audit Area</label>
                                <select value={auditArea} onChange={(e) => setAuditArea(e.target.value)}>
                                    <option value="">Select Area...</option>
                                    <option value="WH RM Technical">WH RM Technical</option>
                                    <option value="FG Herbisida">FG Herbisida</option>
                                    <option value="Office">Office</option>
                                </select>
                            </div>
                            <button 
                                className="primary-button" 
                                onClick={startAudit}
                                disabled={!auditorName || !auditArea}
                            >
                                Start New Audit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'form' && (
                <div className="audit-stage">
                    <div className="form-wizard">
                        <div className="wizard-header">
                            <div className="step-indicator">
                                {KRITERIA_5R.map((cat, i) => (
                                    <div 
                                        key={cat.name} 
                                        className={`step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
                                    />
                                ))}
                            </div>
                            <h2>{KRITERIA_5R[currentStep].name}</h2>
                            <p>Score each item from 1 (Poor) to 5 (Excellent)</p>
                        </div>

                        <div className="question-list">
                            {KRITERIA_5R[currentStep].questions.map((q, idx) => (
                                <div key={idx} className="question-item">
                                    <div className="question-text">{q}</div>
                                    <div className="score-selector">
                                        {[1, 2, 3, 4, 5].map(v => (
                                            <button 
                                                key={v}
                                                className={`score-btn ${scores[KRITERIA_5R[currentStep].name][idx] === v ? 'selected' : ''}`}
                                                onClick={() => handleScoreChange(KRITERIA_5R[currentStep].name, idx, v)}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="wizard-footer">
                            <button 
                                className="secondary-button"
                                disabled={currentStep === 0}
                                onClick={() => setCurrentStep(prev => prev - 1)}
                            >
                                Previous
                            </button>
                            {currentStep < KRITERIA_5R.length - 1 ? (
                                <button 
                                    className="primary-button"
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                >
                                    Next Category
                                </button>
                            ) : (
                                <button 
                                    className="primary-button finish-btn"
                                    onClick={calculateResults}
                                >
                                    Submit Audit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {view === 'results' && currentSession && (
                <div className="audit-stage results-view">
                    <div className="results-grid">
                        <div className="results-main">
                            <div className="results-header">
                                <div className="summary-info">
                                    <h1>Audit Report</h1>
                                    <p>{currentSession.area} • {currentSession.date}</p>
                                </div>
                                <div className="total-score-box">
                                    <span className="score-val">{currentSession.totalAverage.toFixed(2)}</span>
                                    <span className="score-label">Average Score</span>
                                </div>
                            </div>

                            <div className="ai-insights-container">
                                <div className="section-title">
                                    <SparklesIcon /> AI Smart Insights
                                </div>
                                {isLoading ? (
                                    <div className="ai-loading">
                                        <ThinkingIcon /> Analyzing performance patterns...
                                    </div>
                                ) : (
                                    <div className="ai-content markdown">
                                        {currentSession.aiInsights}
                                    </div>
                                )}
                            </div>

                            <div className="actions-footer">
                                <button className="outline-button" onClick={() => setView('welcome')}>
                                    <ArrowUpIcon style={{transform: 'rotate(-90deg)'}} /> New Audit
                                </button>
                                <button className="outline-button" onClick={downloadReport}>
                                    <CodeIcon /> Export JSON
                                </button>
                                <button className="outline-button" onClick={() => setDrawerOpen(true)}>
                                    <GridIcon /> History
                                </button>
                            </div>
                        </div>

                        <div className="results-sidebar">
                            <div className="radar-container">
                                <h3>Performance Visual</h3>
                                <RadarChart 
                                    data={Object.entries(currentSession.averages).map(([k, v]) => ({ label: k, value: v }))} 
                                    size={340}
                                />
                            </div>
                            
                            <div className="score-breakdown">
                                <h3>Breakdown</h3>
                                {Object.entries(currentSession.averages).map(([cat, val]) => (
                                    <div key={cat} className="breakdown-item">
                                        <div className="breakdown-label">
                                            <span>{cat}</span>
                                            <span>{val.toFixed(1)}/5.0</span>
                                        </div>
                                        <div className="progress-bg">
                                            <div className="progress-fill" style={{ width: `${(val / 5) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <SideDrawer 
            isOpen={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            title="Audit History"
        >
            <div className="history-list">
                {sessions.length === 0 ? (
                    <div className="empty-history">No past audits recorded.</div>
                ) : (
                    sessions.map(s => (
                        <div key={s.id} className="history-card" onClick={() => { setCurrentSession(s); setDrawerOpen(false); }}>
                            <div className="h-header">
                                <strong>{s.area}</strong>
                                <span>{s.totalAverage.toFixed(2)}</span>
                            </div>
                            <div className="h-meta">{s.date} • {s.auditor}</div>
                        </div>
                    ))
                )}
            </div>
        </SideDrawer>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
