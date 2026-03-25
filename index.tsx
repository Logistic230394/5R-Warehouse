
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { AuditSession, AuditCategory } from './types';
import { KRITERIA_5R } from './constants';
import { generateId } from './utils';

import DottedGlowBackground from './components/DottedGlowBackground';
import SideDrawer from './components/SideDrawer';
import RadarChart from './components/RadarChart';
import { 
    ThinkingIcon, 
    SparklesIcon, 
    ArrowUpIcon, 
    GridIcon,
    CodeIcon,
    FileTextIcon
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
  const [chartSize, setChartSize] = useState(400);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setChartSize(width - 60);
      } else if (width < 768) {
        setChartSize(320);
      } else {
        setChartSize(400);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startAudit = () => {
    if (!auditorName || !auditArea) return;
    const initialScores: Record<string, number[]> = {};
    KRITERIA_5R.forEach(cat => {
        initialScores[cat.name] = cat.questions.map(() => 0); // Start with 0 (unscored)
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
    setSessions(prev => [newSession, ...prev]);
    setView('results');
    setIsLoading(false);
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

  const downloadPDF = async () => {
    if (!resultsRef.current || !currentSession) return;
    
    setIsLoading(true);
    try {
        const element = resultsRef.current;
        
        // Capture the full content of the results view with optimized scale for compression
        const canvas = await html2canvas(element, {
            scale: 1.5, // Reduced scale to keep file size manageable
            useCORS: true,
            backgroundColor: '#004d4d', // Match app background
            logging: false,
            // Force a desktop-like width for the capture to ensure "normal" layout
            windowWidth: 1200,
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
                const clonedElement = clonedDoc.querySelector('.results-view') as HTMLElement;
                const clonedContainer = clonedDoc.querySelector('.results-container') as HTMLElement;
                const clonedRadar = clonedDoc.querySelector('.radar-chart-svg') as SVGElement;
                
                if (clonedElement) {
                    clonedElement.style.width = '1200px';
                    clonedElement.style.overflow = 'visible';
                    clonedElement.style.height = 'auto';
                    clonedElement.style.padding = '40px';
                    clonedElement.style.position = 'relative';
                    clonedElement.scrollTop = 0;
                }

                if (clonedContainer) {
                    clonedContainer.style.width = '1000px';
                    clonedContainer.style.margin = '0 auto';
                    // Force grid to 2 columns even on mobile export
                    const visualSection = clonedContainer.querySelector('.performance-visual-section') as HTMLElement;
                    if (visualSection) {
                        visualSection.style.display = 'grid';
                        visualSection.style.gridTemplateColumns = '1fr 1fr';
                        visualSection.style.gap = '32px';
                    }
                    
                    // Force header to horizontal layout
                    const header = clonedContainer.querySelector('.results-header') as HTMLElement;
                    if (header) {
                        header.style.display = 'flex';
                        header.style.flexDirection = 'row';
                        header.style.justifyContent = 'space-between';
                        header.style.alignItems = 'flex-start';
                        header.style.textAlign = 'left';
                    }

                    const metaGrid = clonedContainer.querySelector('.meta-grid') as HTMLElement;
                    if (metaGrid) {
                        metaGrid.style.display = 'grid';
                        metaGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
                    }
                }

                // Ensure radar chart is at its full size in the PDF
                if (clonedRadar) {
                    clonedRadar.setAttribute('width', '400');
                    clonedRadar.setAttribute('height', '400');
                }
            }
        });
        
        // Use JPEG with 0.7 quality for significant compression while maintaining readability
        const imgData = canvas.toDataURL('image/jpeg', 0.7);
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4',
            compress: true // Enable internal PDF compression
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const imgWidth = imgProps.width * ratio;
        const imgHeight = imgProps.height * ratio;
        
        // Center the image on the PDF page
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
        pdf.save(`Audit_Report_${currentSession.area}_${currentSession.date.replace(/\//g, '-')}.pdf`);
    } catch (error) {
        console.error("PDF generation failed", error);
    } finally {
        setIsLoading(false);
    }
  };

  const isStepComplete = scores[KRITERIA_5R[currentStep]?.name]?.every(s => s > 0);

  return (
    <>
        <div className="immersive-app">
            <DottedGlowBackground 
                gap={24} 
                radius={1.5} 
                color="rgba(135, 206, 235, 0.1)" 
                glowColor="rgba(64, 224, 208, 0.3)" 
                speedScale={0.2} 
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
                            {KRITERIA_5R[currentStep].questions.map((q, idx) => {
                                const currentScore = scores[KRITERIA_5R[currentStep].name][idx];
                                return (
                                    <div key={idx} className="question-item-container">
                                        <div className="question-item">
                                            <div className="question-text">{q.text}</div>
                                            <div className="score-selector">
                                                {[1, 2, 3, 4, 5].map(v => (
                                                    <button 
                                                        key={v}
                                                        className={`score-btn ${currentScore === v ? 'selected' : ''}`}
                                                        onClick={() => handleScoreChange(KRITERIA_5R[currentStep].name, idx, v)}
                                                    >
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {currentScore > 0 && (
                                            <div className="score-description">
                                                <SparklesIcon />
                                                <span>{q.descriptions[currentScore - 1]}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                                    disabled={!isStepComplete}
                                >
                                    Next Category
                                </button>
                            ) : (
                                <button 
                                    className="primary-button finish-btn"
                                    onClick={calculateResults}
                                    disabled={!isStepComplete}
                                >
                                    Submit Audit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {view === 'results' && currentSession && (
                <div className="audit-stage results-view" ref={resultsRef}>
                    <div className="results-container">
                        <div className="results-header">
                            <div className="summary-info">
                                <span className="badge">LAPORAN AUDIT 5R</span>
                                <h1>{currentSession.area}</h1>
                                <div className="meta-grid">
                                    <div className="meta-item">
                                        <span className="meta-label">Auditor</span>
                                        <span className="meta-value">{currentSession.auditor}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Tanggal</span>
                                        <span className="meta-value">{currentSession.date}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">ID Audit</span>
                                        <span className="meta-value">#{currentSession.id}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="total-score-box">
                                <span className="score-val">{currentSession.totalAverage.toFixed(2)}</span>
                                <span className="score-label">Skor Rata-rata</span>
                            </div>
                        </div>

                        <div className="performance-visual-section">
                            <div className="visual-card radar-card">
                                <div className="section-header">
                                    <SparklesIcon />
                                    <h3>Visualisasi Performa</h3>
                                </div>
                                <div className="radar-wrapper">
                                    <RadarChart 
                                        data={Object.entries(currentSession.averages).map(([k, v]: [string, any]) => ({ label: k, value: v }))} 
                                        size={chartSize}
                                    />
                                </div>
                            </div>

                            <div className="visual-card breakdown-card">
                                <div className="section-header">
                                    <GridIcon />
                                    <h3>Breakdown Kategori</h3>
                                </div>
                                <div className="detailed-breakdown">
                                    {Object.entries(currentSession.averages).map(([cat, val]: [string, any]) => (
                                        <div key={cat} className="detailed-item">
                                            <div className="item-info">
                                                <span className="cat-name">{cat}</span>
                                                <span className="cat-score">{val.toFixed(2)} / 5.00</span>
                                            </div>
                                            <div className="progress-track">
                                                <div 
                                                    className="progress-bar" 
                                                    style={{ 
                                                        width: `${(val / 5) * 100}%`,
                                                        backgroundColor: val >= 4 ? '#2dd4bf' : val >= 3 ? '#87ceeb' : '#f87171'
                                                    }} 
                                                />
                                            </div>
                                            <p className="cat-desc">
                                                {val >= 4 ? 'Sangat Baik - Pertahankan standar.' : 
                                                 val >= 3 ? 'Cukup - Perlu peningkatan minor.' : 
                                                 'Kurang - Memerlukan tindakan segera.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="actions-footer" data-html2canvas-ignore>
                            <button className="outline-button" onClick={() => setView('welcome')}>
                                <ArrowUpIcon style={{transform: 'rotate(-90deg)'}} /> Audit Baru
                            </button>
                            <button className="outline-button" onClick={downloadReport}>
                                <CodeIcon /> Ekspor JSON
                            </button>
                            <button className="outline-button" onClick={downloadPDF}>
                                <FileTextIcon /> Ekspor PDF
                            </button>
                            <button className="outline-button" onClick={() => setDrawerOpen(true)}>
                                <GridIcon /> Riwayat
                            </button>
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
  const root = createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
