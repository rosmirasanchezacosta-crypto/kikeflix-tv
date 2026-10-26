export interface Clip {
  titulo: string;
  url: string;
  dur: number; // segundos
}

export interface Commercial {
  titulo: string;
  url: string;
  dur: number;
}

export interface Franja {
  nombre: string;
  desde: number; // hora del dia (0 a 24)
  hasta: number;
  clips: Clip[];
}

export interface ParrillaConfig {
  semana: { franjas: Franja[] };
  finde: { franjas: Franja[] };
}

export interface CanalConfig {
  tzOffsetHoras: number;
  comerciales: {
    activar: boolean;
    cadaClips: number;
    lista: Commercial[];
  };
  parrillas: ParrillaConfig;
}

export const CANAL_CONFIG: CanalConfig = {
  tzOffsetHoras: -5, // UTC-5 (Colombia / Perú / Ecuador / Panamá / Valledupar)
  comerciales: {
    activar: true,
    cadaClips: 2,
    lista: [
      {
        titulo: "Promo 50% OFF - KikeFlix VIP",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        dur: 15
      },
      {
        titulo: "Planes VIP KikeFlix",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        dur: 15
      }
    ]
  },
  parrillas: {
    semana: {
      franjas: [
        {
          nombre: "Madrugada adultos",
          desde: 0,
          hasta: 3,
          clips: [
            { titulo: "El diablo viste a la moda (2006)", url: "https://archive.org/download/el-diablo-viste-a-la-moda_202101/EL%20DIABLO%20VISTE%20A%20LA%20MODA%20%28720%29.mp4", dur: 6564 },
            { titulo: "El despertar del diablo (2006)", url: "https://archive.org/download/ElDespertarDelDiablo2006/El%20despertar%20del%20diablo%20%282006%29%20-%20pelicula%20Terror%20Online.mp4", dur: 6505 }
          ]
        },
        {
          nombre: "Madrugada normal",
          desde: 3,
          hasta: 6,
          clips: [
            { titulo: "El diablo viste a la moda (2006)", url: "https://archive.org/download/el-diablo-viste-a-la-moda_202101/EL%20DIABLO%20VISTE%20A%20LA%20MODA%20%28720%29.mp4", dur: 6564 },
            { titulo: "El despertar del diablo (2006)", url: "https://archive.org/download/ElDespertarDelDiablo2006/El%20despertar%20del%20diablo%20%282006%29%20-%20pelicula%20Terror%20Online.mp4", dur: 6505 },
            { titulo: "Al diablo con el diablo (2000)", url: "https://archive.org/download/como-me-converti-en-superheroe/Al%20diablo%20con%20el%20diablo.mp4", dur: 5589 },
            { titulo: "Jóvenes y brujas (The Craft)(1996)", url: "https://archive.org/download/the-craft-1996_202409/THE%20CRAFT%20%20%281996%29.ia.mp4", dur: 6059 },
            { titulo: "Las Brujas (1990)", url: "https://archive.org/download/peliculas-1990/Ver%20La%20Maldici%C3%B3n%20de%20las%20Brujas%20%281990%29%20Online%20Latino%20HD%20-.mp4", dur: 5495 },
            { titulo: "HD Pequeña tienda de los horrores (1986)", url: "https://pomf2.lain.la/f/rdlzyocn.mp4", dur: 6192 },
            { titulo: "Aliens: El regreso (1986)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/4.ALIENS%20EL%20REGRESO%20%281986%29%20%E2%9C%94.ia.mp4", dur: 9267 },
            { titulo: "Poltergeist (1982)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/POLTERGEIST%201%20%281982%29%20%E2%9C%94.mp4", dur: 6868 },
            { titulo: "A Nightmare on Elm Street (1984)", url: "https://archive.org/download/cesser-16-liga-de-la-justicia-720p/%40cesser16%20Pesadilla%20en%20la%20calle%20del%20infierno%20%281984%29%201080p.mp4", dur: 5474 },
            { titulo: "Friday the 13th (1980)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/%E2%9C%A0%2001.-%20VIERNES%2013%20%281980%29.mp4", dur: 5630 },
            { titulo: "Saw I (2004)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/01.-%20SAW%20%282004%29.mp4", dur: 5931 }
          ]
        },
        {
          nombre: "Mañana",
          desde: 6,
          hasta: 12,
          clips: [
            { titulo: "Tigre Y Dragón (2000)", url: "https://archive.org/download/tigre-y-dragon-dvdrip-spanish/Tigre%20Y%20Dragon%5BDVDRIP%5D%5BSpanish%5D.mp4", dur: 6912 },
            { titulo: "Johnny Mnemonic (1995)", url: "https://archive.org/download/johnny-mnemonic-1995/Johnny%20Mnemonic%20%281995%29.mp4", dur: 5802 },
            { titulo: "Hércules y el círculo de fuego (1994)", url: "https://archive.org/download/HrculesYElCrculoDeFuego/H%C3%A9rcules%20y%20el%20c%C3%ADrculo%20de%20fuego.mp4", dur: 5437 },
            { titulo: "La máscara (1994)", url: "https://archive.org/download/la-mascara-1994-brrip-720p-x-264-catala-english-per-hal-9000-mecanoscrit.cat/La_mascara_1994_BRrip_720p_x264_catala_english_per_HAL9000_Mecanoscrit.cat_.mp4", dur: 5824 },
            { titulo: "Ace Ventura: Pet Detective (1994)", url: "https://archive.org/download/ace-ventura_202403/Ace%20Ventura%201%20-%20Un%20Detective%20Diferente%20%281994%29.ia.mp4", dur: 5161 },
            { titulo: "Mi pobre angelito 2 (1992)", url: "https://archive.org/download/4-mi-pobre-angelito-2-1992/4%20Mi%20Pobre%20Angelito%202%20%281992%29.mp4", dur: 7201 },
            { titulo: "Hombres de negro (1997)", url: "https://archive.org/download/men-in-black-1997_202409/MEN%20IN%20BLACK%20%20%281997%29.mp4", dur: 5878 },
            { titulo: "Pitch Perfect (2012)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/DANDO%20LA%20NOTA%20%282012%29%20%E2%9C%94.mp4", dur: 6727 },
            { titulo: "The Hangover (2009)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/RESAC%C3%93N%201%20%282009%29%20%E2%9C%94.ia.mp4", dur: 5986 },
            { titulo: "Scary Movie (2000)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/SCARY%20MOVIE%201%20%282000%29%20%E2%9C%94.mp4", dur: 5088 }
          ]
        },
        {
          nombre: "Tarde",
          desde: 12,
          hasta: 19,
          clips: [
            { titulo: "1 Fast 1 Furious: A todo gas 1 (2001)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/01.-%20A%20TODO%20GAS%201%20%282001%29.ia.mp4", dur: 6154 },
            { titulo: "2 Fast 2 Furious: A todo gas 2 (2003)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/02.-%20A%20TODO%20GAS%202%20%282003%29%20%E2%9C%94.ia.mp4", dur: 6190 },
            { titulo: "La jungla 2: Alerta roja (1990)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/LA%20JUNGLA%202%20ALERTA%20ROJA%20%281990%29%20%E2%9C%94.mp4", dur: 7098 },
            { titulo: "El vengador del futuro (1990)", url: "https://archive.org/download/desafio-total-1990/Desafio%20Total%201990.mp4", dur: 6814 },
            { titulo: "Lethal Weapon (1987)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/Ver%20Arma%20Letal%201%20%281987%29%20Online%20-%20Cuevana%203%20Peliculas%20Online.mp4", dur: 6577 },
            { titulo: "Los Juegos del Hambre (2012)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/LOS%20JUEGOS%20DEL%20HAMBRE%201%20%282012%29%20%E2%9C%94.mp4", dur: 8551 },
            { titulo: "El Transportador (2002)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/TRANSPORTER%201%20%282002%29%20%E2%9C%94.mp4", dur: 5403 },
            { titulo: "El caso Bourne (2002)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/1.EL%20CASO%20BOURNE%20%282002%29%20%E2%9C%94.mp4", dur: 6815 },
            { titulo: "Jungla de cristal (1988)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/LA%20JUNGLA%201%20%281988%29%20%E2%9C%94.mp4", dur: 7611 },
            { titulo: "Back to the Future Part II (1989)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/REGRESO%20AL%20FUTURO%20II%20%20%281989%29%20%E2%9C%94.mp4", dur: 6479 }
          ]
        },
        {
          nombre: "Noche de estreno",
          desde: 19,
          hasta: 24,
          clips: [
            { titulo: "Cerrando el círculo (2007)", url: "https://archive.org/download/cerrando-el-circulo-2007-espanol-espana/Cerrando%20el%20C%C3%ADrculo%20%282007%29%20Espa%C3%B1ol%20Espa%C3%B1a.mp4", dur: 6648 },
            { titulo: "Troya (2004)", url: "https://archive.org/download/2004-troya/%282004%29%20Troya.mp4", dur: 9766 },
            { titulo: "RoboCop (1987)", url: "https://archive.org/download/peli8_202402/RoboCop%201987.mp4", dur: 6195 },
            { titulo: "Comando (1985)", url: "https://archive.org/download/commando-1985/COMMANDO%20%20%281985%29%20.ia.mp4", dur: 5416 },
            { titulo: "Rambo: Primera Sangre Parte 2 (1985)", url: "https://archive.org/download/rambo-first-blood-part-2-1985/RAMBO%20FIRST%20BLOOD%20PART%202%20%20%281985%29.ia.mp4", dur: 5753 },
            { titulo: "Los Cazafantasmas (1984)", url: "https://archive.org/download/los-cazafantasmas-1984/Los%20Cazafantasmas%20%281984%29.mp4", dur: 6308 },
            { titulo: "The Matrix (1999)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/%E2%9C%A0%201.-%20MATRIX%20%281999%29%20%E2%9C%94.mp4", dur: 7846 },
            { titulo: "Jurassic Park (1993)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/1.PARQUE%20JUR%C3%81SICO%20%281993%29%20%E2%9C%94.ia.mp4", dur: 7282 },
            { titulo: "El Padrino (1972)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/EL%20PADRINO%201%20%281972%29%20%E2%9C%94.mp4", dur: 10629 }
          ]
        }
      ]
    },
    finde: {
      franjas: [
        {
          nombre: "Madrugada adultos",
          desde: 0,
          hasta: 3,
          clips: [
            { titulo: "A Nightmare on Elm Street 3: Dream Warriors (1987)", url: "https://archive.org/download/cesser-16-liga-de-la-justicia-720p/%40cesser16%20Pesadilla%20en%20la%20calle%20del%20infierno%203%20%281987%29%201080p.mp4", dur: 5791 },
            { titulo: "Pequeña tienda de los horrores (1986)", url: "https://pomf2.lain.la/f/fikj5aec.mp4", dur: 5615 }
          ]
        },
        {
          nombre: "Madrugada normal",
          desde: 3,
          hasta: 6,
          clips: [
            { titulo: "A Nightmare on Elm Street 3: Dream Warriors (1987)", url: "https://archive.org/download/cesser-16-liga-de-la-justicia-720p/%40cesser16%20Pesadilla%20en%20la%20calle%20del%20infierno%203%20%281987%29%201080p.mp4", dur: 5791 },
            { titulo: "Pequeña tienda de los horrores (1986)", url: "https://pomf2.lain.la/f/fikj5aec.mp4", dur: 5615 },
            { titulo: "Las Brujas (1990)", url: "https://archive.org/download/peliculas-1990/Ver%20La%20Maldici%C3%B3n%20de%20las%20Brujas%20%281990%29%20Online%20Latino%20HD%20-.mp4", dur: 5495 },
            { titulo: "Poltergeist (2015)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/POLTERGEIST%20%282015%29%20%E2%9C%94.mp4", dur: 6054 },
            { titulo: "Friday the 13th Part VI: Jason Lives (1986)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/%E2%9C%A0%2006.-%20VIERNES%2013%2006%20Jason%20vive%20%281986%29.mp4", dur: 5230 },
            { titulo: "Saw III (2006)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/03.-%20SAW%203%20%282006%29.mp4", dur: 6235 }
          ]
        },
        {
          nombre: "Mañana infantil & familiar",
          desde: 6,
          hasta: 12,
          clips: [
            { titulo: "Una pareja explosiva (1998)", url: "https://archive.org/download/peli8_202402/Rush%20Hour%201998.mp4", dur: 5867 },
            { titulo: "The Hangover (2009)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/RESAC%C3%93N%201%20%282009%29%20%E2%9C%94.ia.mp4", dur: 5986 },
            { titulo: "La máscara (1994)", url: "https://archive.org/download/la-mascara-1994-brrip-720p-x-264-catala-english-per-hal-9000-mecanoscrit.cat/La_mascara_1994_BRrip_720p_x264_catala_english_per_HAL9000_Mecanoscrit.cat_.mp4", dur: 5824 },
            { titulo: "Solo en casa (1990)", url: "https://archive.org/download/peliculas-1990/Ver%20MI%20Pobre%20Angelito%201%20%281990%29%20Online%20Latino%20HD%20-.mp4", dur: 6174 },
            { titulo: "Ace Ventura: Un Detective Diferente (1994)", url: "https://archive.org/download/ace-ventura_202403/Ace%20Ventura%201%20-%20Un%20Detective%20Diferente%20%281994%29.ia.mp4", dur: 5161 },
            { titulo: "Tigre Y Dragón (2000)", url: "https://archive.org/download/tigre-y-dragon-dvdrip-spanish/Tigre%20Y%20Dragon%5BDVDRIP%5D%5BSpanish%5D.mp4", dur: 6912 }
          ]
        },
        {
          nombre: "Tarde de maratones",
          desde: 12,
          hasta: 19,
          clips: [
            { titulo: "1 Fast 1 Furious: A todo gas 1 (2001)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/01.-%20A%20TODO%20GAS%201%20%282001%29.ia.mp4", dur: 6154 },
            { titulo: "2 Fast 2 Furious: A todo gas 2 (2003)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/02.-%20A%20TODO%20GAS%202%20%282003%29%20%E2%9C%94.ia.mp4", dur: 6190 },
            { titulo: "El cofre de la Muerte (2006)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/2.EL%20COFRE%20DEL%20HOMBRE%20MUERTO%20%282006%29%20%E2%9C%94.ia.mp4", dur: 9039 },
            { titulo: "Los Juegos del Hambre (2012)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/LOS%20JUEGOS%20DEL%20HAMBRE%201%20%282012%29%20%E2%9C%94.mp4", dur: 8551 },
            { titulo: "El fugitivo (1993)", url: "https://archive.org/download/the-fugitive-1993_202409/THE%20FUGITIVE%20%20%281993%29.ia.mp4", dur: 7817 },
            { titulo: "Lethal Weapon (1987)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/Ver%20Arma%20Letal%201%20%281987%29%20Online%20-%20Cuevana%203%20Peliculas%20Online.mp4", dur: 6577 },
            { titulo: "Blade (1998)", url: "https://archive.org/download/blade-1-cazador-de-vampiros-1998-espanol-latino-full-screen/Blade%201%20Cazador%20de%20Vampiros%20%281998%29%20Espa%C3%B1ol%20Latino%20Full%20Screen.mp4", dur: 7213 },
            { titulo: "Back to the Future Part II (1989)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/REGRESO%20AL%20FUTURO%20II%20%20%281989%29%20%E2%9C%94.mp4", dur: 6479 }
          ]
        },
        {
          nombre: "Noche de películas de acción",
          desde: 19,
          hasta: 24,
          clips: [
            { titulo: "Troya (2004)", url: "https://archive.org/download/2004-troya/%282004%29%20Troya.mp4", dur: 9766 },
            { titulo: "The Matrix (1999)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/%E2%9C%A0%201.-%20MATRIX%20%281999%29%20%E2%9C%94.mp4", dur: 7846 },
            { titulo: "RoboCop (1987)", url: "https://archive.org/download/peli8_202402/RoboCop%201987.mp4", dur: 6195 },
            { titulo: "Comando (1985)", url: "https://archive.org/download/commando-1985/COMMANDO%20%20%281985%29%20.ia.mp4", dur: 5416 },
            { titulo: "Jurassic Park (1993)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/1.PARQUE%20JUR%C3%81SICO%20%281993%29%20%E2%9C%94.ia.mp4", dur: 7282 },
            { titulo: "El Padrino Parte II (1974)", url: "https://archive.org/download/mini-espias-4-los-ladrones-del-tiempo-2011-pelicula-cuevana-3/EL%20PADRINO%202%20%281974%29%20%E2%9C%94.mp4", dur: 12126 }
          ]
        }
      ]
    }
  }
};

// Generar secuencia continua con comerciales intercalados
export function armarSecuenciaConAnuncios(clips: Clip[], adsConfig = CANAL_CONFIG.comerciales) {
  if (!clips || !clips.length) return [];
  const seq: Array<{ titulo: string; url: string; dur: number; isAd: boolean }> = [];
  let cont = 0;
  for (const clip of clips) {
    seq.push({ titulo: clip.titulo, url: clip.url, dur: clip.dur, isAd: false });
    cont++;
    if (adsConfig.activar && adsConfig.lista && adsConfig.lista.length && cont % adsConfig.cadaClips === 0) {
      const idx = (Math.floor(cont / adsConfig.cadaClips) - 1) % adsConfig.lista.length;
      const ad = adsConfig.lista[idx];
      seq.push({ titulo: ad.titulo, url: ad.url, dur: ad.dur, isAd: true });
    }
  }
  return seq;
}
