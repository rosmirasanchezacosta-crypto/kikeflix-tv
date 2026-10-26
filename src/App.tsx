import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Tv,
  Calendar,
  Film,
  Clock,
  Radio,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { CANAL_CONFIG } from './data/canalData';

interface NowResponse {
  parrilla: string;
  franja: string;
  titulo: string;
  url: string;
  offset: number;
  duracion: number;
  esComercial: boolean;
  restanteSeg: number;
  siguiente: {
    titulo: string;
    esComercial: boolean;
    duracion?: number;
  } | null;
  serverMs: number;
  tz: string;
}

interface EpgItem {
  inicio: string;
  fin: string;
  franja: string;
  titulo: string;
  duracionSeg: number;
  esComercial: boolean;
  esActual: boolean;
}

interface EpgResponse {
  tz: string;
  dia: string;
  serverMs: number;
  totalProgramas: number;
  programas: EpgItem[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'vivo' | 'epg' | 'catalogo'>('vivo');
  const [nowData, setNowData] = useState<NowResponse | null>(null);
  const [epgData, setEpgData] = useState<EpgResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isBehindLive, setIsBehindLive] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Safe play helper to eliminate "play() interrupted" errors
  const safePlay = async () => {
    const video = videoRef.current;
    if (!video || !isMountedRef.current) return;
    try {
      playPromiseRef.current = video.play();
      await playPromiseRef.current;
      if (isMountedRef.current) setIsPlaying(true);
    } catch (err: unknown) {
      const e = err as { name?: string };
      // Ignore AbortError caused by rapid switching or pause
      if (e?.name !== 'AbortError') {
        // Autoplay policy: retry muted only if initial autoplay failed before any user gesture
        if (!hasUserInteracted) {
          video.muted = true;
          setIsMuted(true);
          try {
            playPromiseRef.current = video.play();
            await playPromiseRef.current;
            if (isMountedRef.current) setIsPlaying(true);
          } catch {
            if (isMountedRef.current) setIsPlaying(false);
          }
        } else {
          if (isMountedRef.current) setIsPlaying(!video.paused);
        }
      }
    } finally {
      playPromiseRef.current = null;
    }
  };

  // Safe pause helper
  const safePause = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {
        // Ignore in-flight play errors
      }
    }
    video.pause();
    setIsPlaying(false);
  };

  // Fetch /api/now
  const fetchNow = async () => {
    try {
      const res = await fetch('/api/now');
      if (res.ok) {
        const data: NowResponse = await res.json();
        if (isMountedRef.current) {
          setNowData(data);
          setStreamError(null);
        }
      }
    } catch {
      // Ignore network glitch
    }
  };

  // Fetch /api/epg
  const fetchEpg = async () => {
    try {
      const res = await fetch('/api/epg');
      if (res.ok) {
        const data: EpgResponse = await res.json();
        if (isMountedRef.current) setEpgData(data);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchNow();
    fetchEpg();
    const interval = setInterval(fetchNow, 12000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !nowData) return;
    if (nowData.offset > 0 && Math.abs(video.currentTime - nowData.offset) > 3) {
      try {
        video.currentTime = nowData.offset;
      } catch {
        // Ignore seek error before user gesture
      }
    }
    safePlay();
  };

  // Synchronize video player to server stream URL and offset
  useEffect(() => {
    if (!videoRef.current || !nowData || !nowData.url) return;

    const video = videoRef.current;
    const currentSrc = video.currentSrc || video.src;

    if (!currentSrc.includes(nowData.url)) {
      video.src = nowData.url;
      video.load();
    } else if (video.readyState >= 1) {
      handleLoadedMetadata();
    }
  }, [nowData?.url]);

  // Monitor live drift (check if paused or behind)
  useEffect(() => {
    const checkDrift = () => {
      const video = videoRef.current;
      if (!video || !nowData) return;
      if (video.paused) {
        setIsBehindLive(true);
      } else if (nowData.offset > 0 && Math.abs(video.currentTime - nowData.offset) > 10) {
        setIsBehindLive(true);
      } else {
        setIsBehindLive(false);
      }
    };

    const driftInterval = setInterval(checkDrift, 3000);
    return () => clearInterval(driftInterval);
  }, [nowData]);

  // Jump to live edge
  const syncToLive = () => {
    const video = videoRef.current;
    if (!video || !nowData) return;
    if (nowData.offset > 0) {
      video.currentTime = nowData.offset;
    }
    safePlay();
    setIsBehindLive(false);
  };

  const handleVideoError = () => {
    setStreamError('Sincronizando señal en vivo con el servidor...');
    setTimeout(fetchNow, 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 4000);
  };

  const togglePlay = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setHasUserInteracted(true);
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      handleResumePlay(e);
    } else {
      safePause();
    }
  };

  const handleResumePlay = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setHasUserInteracted(true);
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.volume = volume;
    try {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          if (isMountedRef.current) setIsPlaying(true);
        }).catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
          if (isMountedRef.current) setIsPlaying(true);
        });
      }
    } catch {
      // Ignored
    }
    if (isMountedRef.current) setIsPlaying(true);
  };

  const handleUnmute = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    setHasUserInteracted(true);

    // 1. Unmute DOM element and update state
    video.muted = false;
    setIsMuted(false);

    const targetVol = volume > 0 ? volume : 0.8;
    video.volume = targetVol;
    setVolume(targetVol);

    // 2. Unconditionally invoke play() inside this user gesture
    // This satisfies Chrome/Safari audio autoplay policies and prevents the browser from pausing
    try {
      const p = video.play();
      if (p !== undefined) {
        p.then(() => {
          if (isMountedRef.current) setIsPlaying(true);
        }).catch((err) => {
          console.warn('Playback error after unmute:', err);
          // Fallback: if browser strictly prevents unmuted playback in iframe, keep playing muted
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
    } catch {
      // Ignored
    }
    if (isMountedRef.current) setIsPlaying(true);
  };

  const toggleMute = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;
    setHasUserInteracted(true);

    if (isMuted) {
      handleUnmute(e);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    // In a live channel: if paused, click resumes it. If already playing, toggle controls.
    if (video.paused) {
      handleResumePlay(e);
    } else {
      setShowControls((prev) => !prev);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    setHasUserInteracted(true);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
      if (val > 0 && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const progressPercent = nowData && nowData.duracion > 0
    ? Math.min(100, Math.max(0, (nowData.offset / nowData.duracion) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-[#07090e] text-stone-100 font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-stone-800/80 bg-[#0c0e14]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
              <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-black tracking-wider text-white">
                  KIKE<span className="text-red-500">FLIX</span><span className="text-stone-400 text-[10px] sm:text-xs font-mono">.TV</span>
                </span>
                <span className="flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  EN VIVO
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-400 hidden sm:block">
                Canal lineal continuo sincronizado (UTC-5)
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Mobile Optimized: vivo, epg, catalogo) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('vivo')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'vivo'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden xs:inline sm:inline">En Vivo</span>
            </button>
            <button
              onClick={() => setActiveTab('epg')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'epg'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Guía EPG</span>
            </button>
            <button
              onClick={() => setActiveTab('catalogo')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'catalogo'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Parrillas</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* TV Player Container: KEPT PERMANENTLY MOUNTED IN DOM TO PREVENT MEDIA REMOVAL ERROR */}
        <div className={activeTab === 'vivo' ? 'space-y-4 sm:space-y-6 block' : 'hidden'}>
          <div
            ref={playerContainerRef}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-video max-h-[75vh] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-800/80 group"
          >
            {nowData?.url ? (
              <video
                ref={videoRef}
                src={nowData.url}
                autoPlay
                playsInline
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onPlaying={() => setIsPlaying(true)}
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleVideoError}
                onEnded={fetchNow}
                className="w-full h-full object-contain bg-black cursor-pointer"
                onClick={handleVideoClick}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-stone-950">
                <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 animate-spin mb-3" />
                <p className="text-xs sm:text-sm font-bold text-white">Sintonizando señal de KikeFlix.TV...</p>
                <p className="text-[11px] sm:text-xs text-stone-400 mt-1">Sincronizando con el reloj del servidor UTC-5</p>
              </div>
            )}

            {/* Watermark Bug (Top Right) */}
            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 pointer-events-none select-none flex items-center gap-1.5 sm:gap-2 bg-black/50 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-white/10">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-white">KIKEFLIX<span className="text-red-500">.TV</span></span>
            </div>

            {/* Top Left Channel Tag */}
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 pointer-events-none select-none flex items-center gap-1.5 sm:gap-2">
              <span className="bg-red-600 text-white text-[9px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-md">
                EN VIVO
              </span>
              {nowData?.esComercial && (
                <span className="bg-amber-500 text-stone-950 text-[9px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-md animate-pulse">
                  COMERCIAL
                </span>
              )}
              <span className="bg-black/60 backdrop-blur-md text-stone-300 text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-white/10 hidden sm:inline">
                {nowData?.franja}
              </span>
            </div>

            {/* Big Center Play Button when video is paused */}
            {!isPlaying && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleResumePlay(e);
                }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-2xs cursor-pointer group-hover:bg-black/50 transition-colors"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/60 transform hover:scale-110 active:scale-95 transition-all">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                </div>
                <span className="text-white text-xs sm:text-sm font-black uppercase tracking-wider mt-3 bg-stone-900/90 px-4 py-1.5 rounded-full border border-stone-700 shadow-lg">
                  Hacer clic para ver en vivo
                </span>
              </div>
            )}

            {/* Catch Up to Live Edge Button if user paused */}
            {isBehindLive && isPlaying && (
              <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30">
                <button
                  onClick={syncToLive}
                  className="bg-red-600 hover:bg-red-500 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-2xl flex items-center gap-1.5 sm:gap-2 animate-bounce transition-all border border-red-400"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping" />
                  <span>🔴 VOLVER AL DIRECTO</span>
                </button>
              </div>
            )}

            {/* Floating Unmute Notice if playing while muted */}
            {isPlaying && isMuted && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnmute(e);
                }}
                className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={handleUnmute}
                  onTouchEnd={handleUnmute}
                  className="bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs sm:text-sm font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-2xl shadow-red-600/50 flex items-center gap-2 animate-bounce transition-all border-2 border-white/40 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 animate-pulse" />
                  <span>ACTIVAR SONIDO</span>
                </button>
              </div>
            )}

            {/* Stream Error Banner */}
            {streamError && (
              <div className="absolute bottom-16 left-3 right-3 sm:left-4 sm:right-4 z-20 bg-amber-900/90 border border-amber-600 text-amber-100 text-xs p-2.5 sm:p-3 rounded-xl backdrop-blur-md flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{streamError}</span>
              </div>
            )}

            {/* On-Screen Display Controls (Bottom) */}
            <div
              className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-5 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Progress bar */}
              <div className="w-full bg-white/20 h-1 sm:h-1.5 rounded-full overflow-hidden mb-2 sm:mb-3">
                <div
                  className="bg-red-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-stone-400">
                    <span>En vivo:</span>
                    <span className="text-stone-300 font-mono">
                      {formatSeconds(nowData?.offset || 0)} / {formatSeconds(nowData?.duracion || 0)}
                    </span>
                    <span>•</span>
                    <span className="text-amber-400">Resta {formatSeconds(nowData?.restanteSeg || 0)}</span>
                  </div>
                  <h2 className="text-sm sm:text-lg font-black text-white truncate drop-shadow-md">
                    {nowData?.titulo || 'Sintonizando...'}
                  </h2>
                </div>

                {/* Buttons Row */}
                <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={togglePlay}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title={isPlaying ? 'Pausar' : 'Reanudar'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
                    </button>

                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1.5 rounded-xl">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-red-400 transition-colors"
                        title={isMuted ? 'Activar sonido' : 'Silenciar'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-12 sm:w-20 accent-red-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={syncToLive}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Resincronizar con el servidor en vivo"
                    >
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Pantalla completa"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Cards Below Player */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#0f121a] p-4 sm:p-5 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="uppercase font-bold tracking-wider text-red-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" /> En Emisión
                </span>
                <span className="text-[11px] bg-stone-800/80 px-2 py-0.5 rounded-md text-stone-300">
                  {nowData?.franja}
                </span>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">{nowData?.titulo}</h3>
              <div className="mt-3 text-xs text-stone-400 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>Transcurrido:</span>
                  <span className="text-stone-200">{formatSeconds(nowData?.offset || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span className="text-stone-200">{formatSeconds(nowData?.duracion || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiempo restante:</span>
                  <span className="text-amber-400 font-bold">{formatSeconds(nowData?.restanteSeg || 0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0f121a] p-4 sm:p-5 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="uppercase font-bold tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> A Continuación
                </span>
                {nowData?.siguiente?.esComercial && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    Comercial
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">
                {nowData?.siguiente?.titulo || 'Fin de franja'}
              </h3>
              <p className="text-xs text-stone-400 mt-3 leading-relaxed">
                Inicia automáticamente al finalizar la emisión actual sin interrupciones.
              </p>
            </div>

            <div className="bg-[#0f121a] p-4 sm:p-5 rounded-2xl border border-stone-800">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sincronización
                </span>
                <span className="font-mono text-[11px] bg-stone-800/80 px-2 py-0.5 rounded-md text-stone-300">
                  {nowData?.tz || 'UTC-5'}
                </span>
              </div>
              <div className="text-xl font-black text-white font-mono">
                {nowData ? new Date(nowData.serverMs).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' }) : '--:--:--'}
              </div>
              <p className="text-xs text-stone-400 mt-2">
                Todos los espectadores disfrutan exactamente del mismo segundo en vivo.
              </p>
            </div>
          </div>
        </div>

        {/* EPG Tab */}
        {activeTab === 'epg' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f121a] p-4 sm:p-5 rounded-2xl border border-stone-800">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-500" /> Guía de Programación de Hoy
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Horarios calculados en hora local de Valledupar / Colombia (UTC-5)
                </p>
              </div>
              <button
                onClick={fetchEpg}
                className="inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar Guía</span>
              </button>
            </div>

            <div className="bg-[#0c0e14] rounded-2xl border border-stone-800 overflow-hidden divide-y divide-stone-800/80">
              {epgData?.programas.map((prog, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 transition-colors ${
                    prog.esActual
                      ? 'bg-red-950/25 border-l-4 border-l-red-500'
                      : 'hover:bg-stone-900/40'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="font-mono text-xs sm:text-sm font-bold text-stone-300 w-24 sm:w-28 shrink-0">
                      {prog.inicio} – {prog.fin}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        {prog.esActual && (
                          <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                            EN VIVO AHORA
                          </span>
                        )}
                        {prog.esComercial && (
                          <span className="bg-amber-500/20 text-amber-300 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                            Comercial
                          </span>
                        )}
                        <span className="text-[10px] sm:text-[11px] text-stone-400 bg-stone-800/60 px-2 py-0.5 rounded-md">
                          {prog.franja}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm sm:text-base mt-1">{prog.titulo}</h4>
                    </div>
                  </div>

                  <div className="text-[11px] sm:text-xs font-mono text-stone-500 sm:text-right shrink-0">
                    Duración: {formatSeconds(prog.duracionSeg)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogo Tab */}
        {activeTab === 'catalogo' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#0f121a] p-4 sm:p-5 rounded-2xl border border-stone-800">
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-red-500" /> Parrilla de Franjas y Catálogo
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Estructura horaria de lunes a domingo con sus películas programadas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {CANAL_CONFIG.parrillas.semana.franjas.map((franja, idx) => (
                <div key={idx} className="bg-[#0f121a] p-4 sm:p-5 rounded-2xl border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                      <span className="font-mono text-red-400 font-bold">
                        {String(franja.desde).padStart(2, '0')}:00 – {String(franja.hasta).padStart(2, '0')}:00 hrs
                      </span>
                      <span>{franja.clips.length} películas</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{franja.nombre}</h3>

                    <ul className="space-y-1.5 text-xs text-stone-300 divide-y divide-stone-800/40">
                      {franja.clips.slice(0, 6).map((c, i) => (
                        <li key={i} className="pt-1.5 flex items-center justify-between">
                          <span className="truncate pr-2">• {c.titulo}</span>
                          <span className="font-mono text-stone-500 shrink-0">{formatSeconds(c.dur)}</span>
                        </li>
                      ))}
                    </ul>
                    {franja.clips.length > 6 && (
                      <p className="text-[11px] text-stone-500 mt-2">
                        +{franja.clips.length - 6} películas adicionales en rotación continua
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Clean TV Broadcast Footer (Technical links completely hidden) */}
      <footer className="border-t border-stone-800/80 bg-[#090b10] py-6 text-xs text-stone-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 border border-red-500/30">
              <Tv className="w-3.5 h-3.5" />
            </div>
            <span className="text-stone-300 font-bold tracking-wide">KikeFlix.TV</span>
            <span className="text-stone-500">• Señal Lineal Continua (Valledupar, UTC-5)</span>
          </div>
          <div className="text-stone-500 text-[11px] sm:text-xs">
            © {new Date().getFullYear()} Todos los derechos reservados • Transmisión 24/7
          </div>
        </div>
      </footer>
    </div>
  );
}
