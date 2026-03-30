
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

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
    FileTextIcon,
    TrashIcon,
    AppLogo
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

  // Filter states
  const [filterArea, setFilterArea] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('audit_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        // Filter sessions older than 3 months (90 days)
        const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
        const filtered = parsed.filter((s: AuditSession) => s.timestamp > threeMonthsAgo);
        setSessions(filtered);
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('audit_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

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

                        // Ensure trend card is full width in PDF too
                        const trendCard = visualSection.querySelector('.trend-card') as HTMLElement;
                        if (trendCard) {
                            trendCard.style.gridColumn = '1 / -1';
                        }
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

  const deleteSession = (id: string) => {
    if (window.confirm('Hapus rekaman audit ini?')) {
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSession?.id === id) {
            setCurrentSession(null);
            setView('welcome');
        }
    }
  };

  const isStepComplete = scores[KRITERIA_5R[currentStep]?.name]?.every(s => s > 0);

  const uniqueAreas = Array.from(new Set(sessions.map(s => s.area)));
  const filteredSessions = sessions.filter(s => {
    const matchesArea = filterArea === '' || s.area === filterArea;
    const sessionDate = new Date(s.timestamp);
    const matchesStartDate = filterStartDate === '' || sessionDate >= new Date(filterStartDate);
    const matchesEndDate = filterEndDate === '' || sessionDate <= new Date(filterEndDate + 'T23:59:59');
    return matchesArea && matchesStartDate && matchesEndDate;
  });

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
                        <div className="app-logo-container">
                            <img src="/logo.png" alt="Logo" className="welcome-logo" referrerPolicy="no-referrer" />
                        </div>
                        <h1>5R Internal Audit</h1>
                        <p>FRONT WAREHOUSE AREA</p>
                        
                        <div className="audit-setup-card">
                            <div className="input-group">
                                <label>Auditor Name</label>
                                <select 
                                    value={auditorName} 
                                    onChange={(e) => setAuditorName(e.target.value)}
                                >
                                    <option value="">Select Auditor...</option>
                                    <option value="Eka Yunita">Eka Yunita</option>
                                    <option value="Wantoro">Wantoro</option>
                                    <option value="Angga Pratama">Angga Pratama</option>
                                    <option value="Adin">Adin</option>
                                    <option value="Gatot">Gatot</option>
                                    <option value="Hadijah">Hadijah</option>
                                    <option value="Fadly">Fadly</option>
                                    <option value="Badai">Badai</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Audit Area</label>
                                <select value={auditArea} onChange={(e) => setAuditArea(e.target.value)}>
                                    <option value="">Select Area...</option>
                                    <option value="WH RM Technical">WH RM Technical</option>
                                    <option value="WH FG Herbisida">WH FG Herbisida</option>
                                    <option value="WH Office">WH Office</option>
                                    <option value="WH FG Insek">WH FG Insek</option>
                                    <option value="WH FG Technical">WH FG Technical</option>
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
                                <div className="app-logo-container" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
                                    <AppLogo width="24" height="24" />
                                </div>
                                <div className="badge">
                                    <SparklesIcon />
                                    LAPORAN AUDIT 5R
                                </div>
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
                            <div className="visual-card trend-card full-width">
                                <div className="section-header">
                                    <SparklesIcon className="spin-icon" />
                                    <h3>Tren Performa (3 Bulan Terakhir)</h3>
                                </div>
                                <div className="trend-wrapper">
                                    <TrendChart sessions={sessions} currentArea={currentSession.area} />
                                </div>
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
                            <button className="outline-button delete-action" onClick={() => deleteSession(currentSession.id)}>
                                <TrashIcon /> Hapus Audit
                            </button>
                            <button className="outline-button" onClick={() => setDrawerOpen(true)}>
                                <GridIcon /> Riwayat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="app-footer">
                <span>© 2026 Dept. Plant Logistic | PT Inti Everspring Indonesia</span>
            </footer>
        </div>

        <SideDrawer 
            isOpen={drawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            title="Audit History"
        >
            <div className="history-filters">
                <div className="filter-group">
                    <label>Filter by Area</label>
                    <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
                        <option value="">All Areas</option>
                        {uniqueAreas.map(area => (
                            <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                </div>
                <div className="filter-row">
                    <div className="filter-group">
                        <label>Start Date</label>
                        <input 
                            type="date" 
                            value={filterStartDate} 
                            onChange={(e) => setFilterStartDate(e.target.value)} 
                        />
                    </div>
                    <div className="filter-group">
                        <label>End Date</label>
                        <input 
                            type="date" 
                            value={filterEndDate} 
                            onChange={(e) => setFilterEndDate(e.target.value)} 
                        />
                    </div>
                </div>
                {(filterArea || filterStartDate || filterEndDate) && (
                    <button 
                        className="clear-filters-btn"
                        onClick={() => {
                            setFilterArea('');
                            setFilterStartDate('');
                            setFilterEndDate('');
                        }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="history-list">
                {filteredSessions.length === 0 ? (
                    <div className="empty-history">
                        {sessions.length === 0 ? "No past audits recorded." : "No audits match your filters."}
                    </div>
                ) : (
                    filteredSessions.map(s => (
                        <div key={s.id} className="history-card" onClick={() => { setCurrentSession(s); setDrawerOpen(false); setView('results'); }}>
                            <div className="h-header">
                                <strong>{s.area}</strong>
                                <div className="h-actions">
                                    <span>{s.totalAverage.toFixed(2)}</span>
                                    <button 
                                        className="delete-btn" 
                                        onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                                        title="Hapus"
                                    >
                                        ×
                                    </button>
                                </div>
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

const TrendChart = ({ sessions, currentArea }: { sessions: AuditSession[], currentArea: string }) => {
    const areaData = sessions
        .filter(s => s.area === currentArea)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(s => ({
            date: s.date.split('/').slice(0, 2).join('/'), // Short date
            score: parseFloat(s.totalAverage.toFixed(2))
        }));

    if (areaData.length < 2) {
        return (
            <div className="empty-chart-msg">
                <p>Data pembanding belum cukup.</p>
                <span>Lakukan minimal 2 kali audit di area ini untuk melihat grafik tren.</span>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#40e0d0" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#40e0d0" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.4)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis 
                        domain={[0, 5]} 
                        stroke="rgba(255,255,255,0.4)" 
                        fontSize={10} 
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#002626', 
                            border: '1px solid rgba(64, 224, 208, 0.2)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#40e0d0' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#40e0d0" 
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                        strokeWidth={3}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
