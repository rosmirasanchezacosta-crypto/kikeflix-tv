import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { CANAL_CONFIG, armarSecuenciaConAnuncios, Franja } from './src/data/canalData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// CORS Middleware
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
});

// Cache precalculado en memoria para máxima velocidad
interface FranjaProcesada extends Franja {
  secuencia: Array<{ titulo: string; url: string; dur: number; isAd: boolean }>;
  totalSeq: number;
}

const parrillasProcesadas: {
  semana: { franjas: FranjaProcesada[] };
  finde: { franjas: FranjaProcesada[] };
} = {
  semana: {
    franjas: CANAL_CONFIG.parrillas.semana.franjas.map(f => {
      const secuencia = armarSecuenciaConAnuncios(f.clips, CANAL_CONFIG.comerciales);
      const totalSeq = secuencia.reduce((a, c) => a + c.dur, 0) || 1;
      return { ...f, secuencia, totalSeq };
    })
  },
  finde: {
    franjas: CANAL_CONFIG.parrillas.finde.franjas.map(f => {
      const secuencia = armarSecuenciaConAnuncios(f.clips, CANAL_CONFIG.comerciales);
      const totalSeq = secuencia.reduce((a, c) => a + c.dur, 0) || 1;
      return { ...f, secuencia, totalSeq };
    })
  }
};

function fechaLocal(nowMs: number) {
  return new Date(nowMs + CANAL_CONFIG.tzOffsetHoras * 3600 * 1000);
}

function segundosDelDia(nowMs: number) {
  const d = fechaLocal(nowMs);
  return d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
}

function esFinDeSemana(nowMs: number) {
  const dia = fechaLocal(nowMs).getUTCDay();
  return dia === 0 || dia === 6;
}

function obtenerParrilla(nowMs: number) {
  return esFinDeSemana(nowMs)
    ? { clave: 'finde', franjas: parrillasProcesadas.finde.franjas }
    : { clave: 'semana', franjas: parrillasProcesadas.semana.franjas };
}

function franjaActiva(franjas: FranjaProcesada[], sDia: number) {
  const h = sDia / 3600;
  for (const f of franjas) {
    if (h >= f.desde && h < f.hasta) return f;
  }
  return franjas[franjas.length - 1];
}

function resolverPosicion(seq: Array<{ titulo: string; url: string; dur: number; isAd: boolean }>, pos: number) {
  let acc = 0;
  for (let i = 0; i < seq.length; i++) {
    const item = seq[i];
    if (pos < acc + item.dur) {
      return { item, offset: pos - acc, index: i };
    }
    acc += item.dur;
  }
  return { item: seq[0], offset: 0, index: 0 };
}

export function obtenerEnVivo(nowMs: number = Date.now()) {
  const sDia = segundosDelDia(nowMs);
  const parrilla = obtenerParrilla(nowMs);
  const f = franjaActiva(parrilla.franjas, sDia);

  if (!f || !f.secuencia.length) {
    return {
      parrilla: parrilla.clave,
      franja: 'Sin señal',
      titulo: 'Sin contenido en este horario',
      url: '',
      offset: 0,
      duracion: 0,
      esComercial: false,
      restanteSeg: 0,
      siguiente: null,
      serverMs: nowMs,
      tz: 'America/Bogota (UTC-5)'
    };
  }

  const seq = f.secuencia;
  const totalSeq = f.totalSeq;
  const epochSec = Math.floor(nowMs / 1000);
  const pos = ((epochSec % totalSeq) + totalSeq) % totalSeq;

  const { item, offset, index } = resolverPosicion(seq, pos);
  const siguiente = seq[(index + 1) % seq.length];

  return {
    parrilla: parrilla.clave,
    franja: f.nombre,
    titulo: item.titulo,
    url: item.url,
    offset: Math.max(0, Math.floor(offset)),
    duracion: item.dur,
    esComercial: Boolean(item.isAd),
    restanteSeg: Math.max(0, Math.ceil(item.dur - offset)),
    siguiente: siguiente ? { titulo: siguiente.titulo, esComercial: Boolean(siguiente.isAd), duracion: siguiente.dur } : null,
    serverMs: nowMs,
    tz: 'America/Bogota (UTC-5)'
  };
}

function formatearHHMM(seg: number) {
  const s = ((seg % 86400) + 86400) % 86400;
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  return `${h}:${m}`;
}

export function obtenerGuia(nowMs: number = Date.now()) {
  const parrilla = obtenerParrilla(nowMs);
  const sDia = segundosDelDia(nowMs);
  const diaInicioEpoch = Math.floor(nowMs / 1000) - sDia;
  const programas: Array<{
    inicio: string;
    fin: string;
    franja: string;
    titulo: string;
    duracionSeg: number;
    esComercial: boolean;
    esActual: boolean;
  }> = [];

  for (const f of parrilla.franjas) {
    if (!f.secuencia.length) continue;
    const seq = f.secuencia;
    const totalSeq = f.totalSeq;
    let tSeg = f.desde * 3600;
    const finSeg = f.hasta * 3600;
    let guard = 0;

    while (tSeg < finSeg && guard++ < 300) {
      const epochSec = diaInicioEpoch + tSeg;
      const pos = ((epochSec % totalSeq) + totalSeq) % totalSeq;
      const { item, offset } = resolverPosicion(seq, pos);

      const restante = item.dur - offset;
      const dur = Math.min(restante, finSeg - tSeg);

      if (dur >= 10) {
        const esActual = sDia >= tSeg && sDia < tSeg + dur;
        programas.push({
          inicio: formatearHHMM(tSeg),
          fin: formatearHHMM(tSeg + dur),
          franja: f.nombre,
          titulo: item.titulo,
          duracionSeg: dur,
          esComercial: Boolean(item.isAd),
          esActual
        });
      }
      tSeg += Math.max(1, dur);
    }
  }

  return {
    tz: 'America/Bogota (UTC-5)',
    dia: parrilla.clave,
    serverMs: nowMs,
    totalProgramas: programas.length,
    programas
  };
}

// ===================== RUTAS API =====================
const handleNow = (_req: Request, res: Response) => {
  res.json(obtenerEnVivo());
};

const handleEpg = (_req: Request, res: Response) => {
  res.json(obtenerGuia());
};

// Rutas compatibles con /now y /api/now
app.get('/api/now', handleNow);
app.get('/now', handleNow);

// Rutas compatibles con /epg y /api/epg
app.get('/api/epg', handleEpg);
app.get('/epg', handleEpg);

// Detección inteligente para reproductores externos que coloquen la URL raíz
app.use((req: Request, res: Response, next) => {
  if (req.path === '/' || req.path === '') {
    const ua = (req.headers['user-agent'] || '').toLowerCase();
    const isPlayer =
      ua.includes('vlc') ||
      ua.includes('lavf') ||
      ua.includes('exoplayer') ||
      ua.includes('kodi') ||
      ua.includes('tivimate') ||
      ua.includes('smarttv') ||
      ua.includes('iptv') ||
      ua.includes('mpv') ||
      ua.includes('ffmpeg') ||
      ua.includes('gstreamer') ||
      ua.includes('potplayer');

    if (isPlayer) {
      return handleLive(req, res);
    }
  }
  next();
});

// Emisión directa: Redirige automáticamente al MP4 en el segundo exacto
const handleLive = (_req: Request, res: Response) => {
  const vivo = obtenerEnVivo();
  if (vivo && vivo.url) {
    return res.redirect(302, `${vivo.url}#t=${vivo.offset}`);
  }
  return res.status(503).json({ error: true, mensaje: 'Sin emisión en este momento' });
};
app.get('/live', handleLive);
app.get('/live.mp4', handleLive);
app.get('/stream', handleLive);
app.get('/stream.mp4', handleLive);
app.get('/canal.mp4', handleLive);

// Lista M3U para reproductores IPTV, VLC, Smart TVs y Kodi
app.get('/playlist.m3u', (req: Request, res: Response) => {
  const vivo = obtenerEnVivo();
  const host = req.get('host') || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const baseUrl = `${proto}://${host}`;
  const m3u = `#EXTM3U x-tvg-url="${baseUrl}/epg"\n` +
    `#EXTINF:-1 tvg-id="kikeflix" tvg-name="KikeFlix TV" group-title="Cine en Vivo",KikeFlix TV (${vivo.titulo})\n` +
    `${baseUrl}/live\n`;
  res.setHeader('Content-Type', 'application/x-mpegurl');
  res.setHeader('Content-Disposition', 'inline; filename="kikeflix.m3u"');
  res.send(m3u);
});
app.get('/playlist.m3u8', (req: Request, res: Response) => {
  res.redirect('/playlist.m3u');
});
app.get('/kikeflix.m3u', (req: Request, res: Response) => {
  res.redirect('/playlist.m3u');
});
app.get('/kikeflix.m3u8', (req: Request, res: Response) => {
  res.redirect('/playlist.m3u');
});

app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    canal: 'KikeFlix.TV',
    estado: 'EN VIVO Y OPERATIVO',
    motor: 'Node.js Express + Sincronización UTC-5',
    horaServidor: new Date().toISOString(),
    endpoints: {
      emisionDirecta: '/live',
      listaIPTV: '/playlist.m3u',
      enVivoJSON: '/now',
      guiaProgramacionJSON: '/epg'
    }
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 KikeFlix.TV en vivo en http://localhost:${PORT}`);
  });
}

startServer();
