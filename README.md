# KikeFlix.TV - Canal Lineal Continuo en Vivo

Canal de televisión lineal continua 24/7 sincronizado en hora local de Valledupar / Colombia (UTC-5), con programación por franjas, cortes comerciales y soporte para reproductores externos.

## 🚀 Despliegue Rápido y Gratuito (Render / Railway / Vercel)

Este proyecto corre en Node.js y se despliega en 1 minuto en cualquier servicio gratuito sin tarjeta de crédito:

### En Render.com:
1. Conecta tu repositorio de GitHub.
2. Selecciona **Web Service**.
3. Configuración:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free ($0)
4. ¡Listo! Tu canal estará transmitiendo 24/7.

## 📡 Endpoints del Canal

- **`/`**: Reproductor Web oficial con Guía EPG y Parrillas horarias. (Si un reproductor como VLC o IPTV entra aquí, se le entrega la señal de video automáticamente).
- **`/live`**: Stream directo en vivo para VLC, IPTV Smarters, TV Box, MX Player y Smart TVs.
- **`/playlist.m3u`**: Lista M3U para reproductores y aplicaciones IPTV.
- **`/now`**: Estado de emisión actual en formato JSON.
- **`/epg`**: Guía electrónica de programación de 24 horas en JSON.
