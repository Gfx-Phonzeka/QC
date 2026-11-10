import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Maximize2, Camera, AlertTriangle, CheckCircle, 
  Clock, Shield, User, LogOut, Download, LayoutGrid, Layout, 
  Volume2, VolumeX, MessageSquare, RefreshCw, Send, Filter, Check
} from 'lucide-react';

// Mock Sports Feeds Configuration (25 Sports)
const SPORTS_FEEDS = [
  { id: 1, name: 'Atletismo (Pista)', venue: 'Estádio Nacional', icon: '🏃' },
  { id: 2, name: 'Natação', venue: 'Centro Aquático', icon: '🏊' },
  { id: 3, name: 'Basquetebol 5x5', venue: 'Arena Esportiva 1', icon: '🏀' },
  { id: 4, name: 'Voleibol de Praia', venue: 'Arena de Praia', icon: '🏐' },
  { id: 5, name: 'Ginástica Artística', venue: 'Ginásio Olímpico', icon: '🤸' },
  { id: 6, name: 'Futebol Feminino', venue: 'Estádio Central', icon: '⚽' },
  { id: 7, name: 'Ténis de Mesa', venue: 'Pavilhão 2', icon: '🏓' },
  { id: 8, name: 'Judó', venue: 'Centro de Artes Marciais', icon: '🥋' },
  { id: 9, name: 'Boxe', venue: 'Pavilhão 1', icon: '🥊' },
  { id: 10, name: 'Ciclismo de Pista', venue: 'Velódromo', icon: '🚴' },
  { id: 11, name: 'Esgrima', venue: 'Pavilhão 3', icon: '🤺' },
  { id: 12, name: 'Hóquei em Campo', venue: 'Campo de Hóquei', icon: '🏑' },
  { id: 13, name: 'Voleibol de Pavilhão', venue: 'Arena Esportiva 2', icon: '🏐' },
  { id: 14, name: 'Taekwondo', venue: 'Centro de Artes Marciais', icon: '🥋' },
  { id: 15, name: 'Remo', venue: 'Lagoa de Regatas', icon: '🚣' },
  { id: 16, name: 'Canoagem Velocidade', venue: 'Lagoa de Regatas', icon: '🛶' },
  { id: 17, name: 'Andebol', venue: 'Pavilhão 4', icon: '🤾' },
  { id: 18, name: 'Halterofilismo', venue: 'Pavilhão 1', icon: '🏋️' },
  { id: 19, name: 'Skate Street', venue: 'Urban Park', icon: '🛹' },
  { id: 20, name: 'Surf', venue: 'Praia Principal', icon: '🏄' },
  { id: 21, name: 'Tiro com Arco', venue: 'Campo de Tiro', icon: '🏹' },
  { id: 22, name: 'Triatlo', venue: 'Orla Marítima', icon: '🏊' },
  { id: 23, name: 'Badminton', venue: 'Pavilhão 2', icon: '🏸' },
  { id: 24, name: 'Vela', venue: 'Marina Principal', icon: '⛵' },
  { id: 25, name: 'Rugby Sevens', venue: 'Estádio Secundário', icon: '🏉' }
];

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: '', role: 'auditor', id: '' });
  
  // App views & feeds layout
  const [viewMode, setViewMode] = useState('auditor'); // 'auditor' (2x1) or 'grid' (25 feeds)
  const [selectedFeeds, setSelectedFeeds] = useState([1, 2]); // Active 2 feeds for Auditor mode
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // Incident capture form state
  const [incidentModalFeed, setIncidentModalFeed] = useState(null);
  const [incidentCapturedImage, setIncidentCapturedImage] = useState(null);
  const [incidentType, setIncidentType] = useState('P2'); // P1 (Critical), P2 (Major), P3 (Minor)
  const [incidentDesc, setIncidentDesc] = useState('');
  
  // Intercom / Discord mock chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Coord. MCR', role: 'Chefe QC', text: 'Boas-vindas à equipa de QC dos Jogos Pan-Americanos. Feeds 01 a 25 ativos via WebRTC.', time: '10:00:12' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.name.trim()) return;
    const user = {
      name: loginForm.name,
      role: loginForm.role,
      id: loginForm.id || `OP-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setCurrentUser(user);
    if (user.role === 'coordinator') setViewMode('grid');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Open incident modal with screen capture
  const handleOpenIncidentModal = (feed, canvasRef) => {
    let capturedDataUrl = null;
    if (canvasRef && canvasRef.current) {
      try {
        capturedDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
      } catch (err) {
        console.error('Error capturing frame:', err);
      }
    }
    setIncidentModalFeed(feed);
    setIncidentCapturedImage(capturedDataUrl);
    setIncidentDesc('');
    setIncidentType('P2');
  };

  // Save Incident
  const handleSaveIncident = () => {
    if (!incidentDesc.trim() || !incidentModalFeed) return;
    
    const now = new Date();
    const timecode = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}:${String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0')}`;
    
    const newIncident = {
      id: `INC-${Date.now().toString().slice(-5)}`,
      feedId: incidentModalFeed.id,
      feedName: incidentModalFeed.name,
      venue: incidentModalFeed.venue,
      severity: incidentType,
      description: incidentDesc,
      capturedImage: incidentCapturedImage,
      timecode: timecode,
      timestamp: now.toLocaleTimeString(),
      operator_name: currentUser.name,
      operator_role: currentUser.role,
      operator_id: currentUser.id,
      status: 'Open'
    };

    setIncidents([newIncident, ...incidents]);
    setIncidentModalFeed(null);
    setIncidentCapturedImage(null);
  };

  // Export JSON Report
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `panam_qc_incidents_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV Report
  const exportCSV = () => {
    if (incidents.length === 0) return alert('Sem incidências registadas.');
    const headers = ["ID", "Feed", "Venue", "Gravidade", "Descrição", "Timecode SMPTE", "Hora", "Operador", "Função", "ID Operador", "Estado"];
    const rows = incidents.map(inc => [
      inc.id,
      `"${inc.feedName}"`,
      `"${inc.venue}"`,
      inc.severity,
      `"${inc.description.replace(/"/g, '""')}"`,
      inc.timecode,
      inc.timestamp,
      `"${inc.operator_name}"`,
      `"${inc.operator_role}"`,
      inc.operator_id,
      inc.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('
');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_qc_panam_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Login Screen Render
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 max-w-md">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Jogos Pan-Americanos</h1>
            <p className="text-sm text-slate-400">Sistema Remoto de Controlo de Qualidade Editorial (QC)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Nome do Operador</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Carlos Silva"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition"
                value={loginForm.name}
                onChange={e => setLoginForm({...loginForm, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Função / Perfil</label>
              <select 
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition"
                value={loginForm.role}
                onChange={e => setLoginForm({...loginForm, role: e.target.value})}
              >
                <option value="auditor">Auditor Editorial (QC Feeds)</option>
                <option value="coordinator">Chefe de QC / Coordenador MCR</option>
                <option value="engineer">Engenheiro Broadcast (IBC Ingest)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">ID do Operador (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ex: OP-8042"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-500 transition"
                value={loginForm.id}
                onChange={e => setLoginForm({...loginForm, id: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition shadow-lg shadow-amber-500/20"
            >
              Entrar na Estação QC
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            IBC Signal Delivery • WebRTC Ultra-Low Latency Gateway
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <span className="font-bold text-lg text-white tracking-wide">PANAM QC MCR</span>
          </div>
          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-mono">
            25 FEEDS LIVE (WEBRTC)
          </span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => setViewMode('auditor')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'auditor' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Layout className="w-4 h-4" />
            <span>Auditor (2x1 16:9)</span>
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg text-xs font-medium transition ${viewMode === 'grid' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Grid Coordenador (25 Feeds)</span>
          </button>
        </div>

        {/* User Info & Export Action */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={exportCSV}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition border border-slate-700"
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>Exportar CSV</span>
          </button>

          <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="text-right">
              <div className="text-xs font-bold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">{currentUser.role} • {currentUser.id}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Video Streams Viewport */}
        <main className="flex-1 p-4 overflow-y-auto bg-slate-950">
          {viewMode === 'auditor' ? (
            /* Auditor 2x1 Layout (Strict 16:9 Ratio Aspect Ratio Containers) */
            <div className="space-y-4 max-w-6xl mx-auto">
              {/* Feed Selector for Auditor */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Atribuição de Canais do Auditor:</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Canal A:</span>
                    <select 
                      value={selectedFeeds[0]} 
                      onChange={e => setSelectedFeeds([Number(e.target.value), selectedFeeds[1]])}
                      className="bg-slate-950 border border-slate-800 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      {SPORTS_FEEDS.map(f => (
                        <option key={f.id} value={f.id}>Feed {String(f.id).padStart(2, '0')}: {f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Canal B:</span>
                    <select 
                      value={selectedFeeds[1]} 
                      onChange={e => setSelectedFeeds([selectedFeeds[0], Number(e.target.value)])}
                      className="bg-slate-950 border border-slate-800 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      {SPORTS_FEEDS.map(f => (
                        <option key={f.id} value={f.id}>Feed {String(f.id).padStart(2, '0')}: {f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2x1 Grid displaying 16:9 strict Aspect Ratio Player */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedFeeds.map(feedId => {
                  const feed = SPORTS_FEEDS.find(f => f.id === feedId);
                  return <VideoPlayerCard key={feed.id} feed={feed} onCaptureIncident={handleOpenIncidentModal} />;
                })}
              </div>
            </div>
          ) : (
            /* Coordinator 25-Feed Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {SPORTS_FEEDS.map(feed => (
                <VideoPlayerCard key={feed.id} feed={feed} compact onCaptureIncident={handleOpenIncidentModal} />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar: Incident Log & Discord Intercom */}
        <aside className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          {/* Incident Log Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-sm text-white">Log de Incidências</span>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full text-xs font-mono">{incidents.length}</span>
            </div>
          </div>

          {/* Incidents List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {incidents.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs">Sem incidências registadas.</p>
              </div>
            ) : (
              incidents.map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 bg-slate-950 border rounded-xl transition cursor-pointer space-y-2 ${
                    inc.severity === 'P1' ? 'border-red-500/50 hover:border-red-500' :
                    inc.severity === 'P2' ? 'border-amber-500/50 hover:border-amber-500' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'P1' ? 'bg-red-500 text-white' :
                      inc.severity === 'P2' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {inc.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{inc.timecode}</span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white">{inc.feedName}</div>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{inc.description}</p>
                  </div>

                  {inc.capturedImage && (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-800">
                      <img src={inc.capturedImage} alt="Snapshot" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Op: {inc.operator_name} ({inc.operator_role})</span>
                    <span>{inc.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Action */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <button 
              onClick={exportJSON}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition flex items-center justify-center space-x-2 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>Descarregar Ficheiro JSON</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Modal: Incident Capture Form */}
      {incidentModalFeed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-white">Registar Incidência Editorial</h3>
              </div>
              <button 
                onClick={() => setIncidentModalFeed(null)} 
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Target Feed & Captured Frame Preview */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-amber-500 uppercase">
                Feed: {incidentModalFeed.name} ({incidentModalFeed.venue})
              </div>

              {incidentCapturedImage ? (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                  <img src={incidentCapturedImage} alt="Captured Frame" className="w-full h-full object-contain" />
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur text-[10px] font-mono text-emerald-400 rounded">
                    FRAME CAPTURED
                  </span>
                </div>
              ) : (
                <div className="aspect-video bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
                  Captura de ecrã indisponível
                </div>
              )}
            </div>

            {/* Severity Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Gravidade da Anomalia</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'P1', label: 'P1 - Crítica (Sem Sinal / Erro Grave)' },
                  { id: 'P2', label: 'P2 - Erro Gráfico / Áudio' },
                  { id: 'P3', label: 'P3 - Pequeno Desvio' }
                ].map(sev => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setIncidentType(sev.id)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition ${
                      incidentType === sev.id 
                        ? sev.id === 'P1' ? 'bg-red-500 text-white border-red-500' : sev.id === 'P2' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-700 text-white border-slate-600'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {sev.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Descrição Detalhada do Erro</label>
              <textarea 
                rows="3"
                placeholder="Ex: Grafismo de placar congelado no minuto 12:30. Áudio sem faixa de som ambiente..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                value={incidentDesc}
                onChange={e => setIncidentDesc(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button 
                onClick={() => setIncidentModalFeed(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveIncident}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition shadow-lg shadow-amber-500/20"
              >
                Submeter Incidência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Video Player with Strict 16:9 Aspect Ratio & WebRTC Stream Simulation
function VideoPlayerCard({ feed, compact = false, onCaptureIncident }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Simulated WebRTC 60fps Broadcast Stream via HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Safe Area lines (16:9 Broadcast standard)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.9, canvas.height * 0.9);
      ctx.setLineDash([]);

      // Animated Sports Graphic Representation
      angle += 0.04;
      const x = canvas.width / 2 + Math.cos(angle) * (canvas.width * 0.3);
      const y = canvas.height / 2 + Math.sin(angle * 1.5) * (canvas.height * 0.2);

      ctx.beginPath();
      ctx.arc(x, y, compact ? 12 : 24, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();

      // Pan-American Games Overlay Banner
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(15, 15, compact ? 120 : 180, compact ? 22 : 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = compact ? '10px sans-serif' : '12px sans-serif';
      ctx.fillText(`LIVE • ${feed.name.toUpperCase()}`, 25, compact ? 30 : 36);

      // Running Timecode
      const now = new Date();
      const tc = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}:${String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0')}`;
      ctx.fillStyle = '#00ffcc';
      ctx.font = compact ? '9px monospace' : '11px monospace';
      ctx.fillText(`TC: ${tc}`, canvas.width - (compact ? 110 : 130), canvas.height - 15);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [feed, compact]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={containerRef}
      onDoubleClick={toggleFullscreen}
      className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col group relative ${
        compact ? '' : 'shadow-lg'
      }`}
    >
      {/* Strict 16:9 Aspect Ratio Container */}
      <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={1280} 
          height={720} 
          className="w-full h-full object-contain"
        />

        {/* Live Status Overlay */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-red-600/90 text-white rounded text-[10px] font-bold tracking-wider animate-pulse">
            LIVE
          </span>
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur text-emerald-400 rounded text-[10px] font-mono">
            32ms (WHEP)
          </span>
        </div>

        {/* Hover Controls Bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-end p-3">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onCaptureIncident(feed, canvasRef)}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs transition flex items-center space-x-1 shadow"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>INCIDÊNCIA</span>
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            <button 
              onClick={toggleFullscreen}
              className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feed Information Footer */}
      <div className="p-2.5 bg-slate-900 flex items-center justify-between border-t border-slate-800">
        <div className="truncate">
          <span className="text-xs font-bold text-white block truncate">
            {feed.icon} Feed {String(feed.id).padStart(2, '0')} • {feed.name}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">{feed.venue}</span>
        </div>
      </div>
    </div>
  );
}
