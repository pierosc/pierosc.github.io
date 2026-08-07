"use client";

import { useEffect, useRef, useState } from "react";

type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  year: string;
  era: string;
  copy: string;
  quote: string;
  beats: string[];
  color: string;
  image: string;
  imagePosition?: string;
  glyph: string;
};

const chapters: Chapter[] = [
  {
    id: "ep1",
    eyebrow: "Episodio I · La amenaza fantasma",
    title: "El elegido",
    year: "32 ABY",
    era: "La República se agrieta",
    copy: "Qui-Gon Jinn descubre en Tatooine a Anakin Skywalker, un niño con una conexión extraordinaria con la Fuerza. Mientras Naboo resiste una invasión, Darth Maul confirma lo impensable: los Sith han regresado.",
    quote: "Una promesa luminosa proyecta su primera sombra.",
    beats: ["La crisis de Naboo", "Anakin deja Tatooine", "Palpatine asciende"],
    color: "#f3ca52",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2200&q=90",
    glyph: "I",
  },
  {
    id: "ep2",
    eyebrow: "Episodio II · El ataque de los clones",
    title: "La guerra comienza",
    year: "22 ABY",
    era: "Miles de sistemas se separan",
    copy: "Obi-Wan descubre en Kamino un ejército creado en secreto. Anakin y Padmé se enamoran mientras la República, empujada por Palpatine, acepta el conflicto que transformará a los Jedi en generales.",
    quote: "La paz muere entre millones de soldados idénticos.",
    beats: ["El misterio de Kamino", "Geonosis", "Nacen las Guerras Clon"],
    color: "#58c7ff",
    image: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=2200&q=90",
    glyph: "II",
  },
  {
    id: "clone-wars",
    eyebrow: "The Clone Wars · Serie",
    title: "Héroes en llamas",
    year: "22—19 ABY",
    era: "La galaxia arde",
    copy: "Anakin entrena a Ahsoka Tano. Junto a Rex, Obi-Wan y miles de clones, combate de mundo en mundo sin comprender que cada victoria alimenta el plan de Sidious. Maul regresa y Mandalore cae en el último día de la República.",
    quote: "Los mejores guerreros de la galaxia son piezas de un mismo tablero.",
    beats: ["Ahsoka abandona la Orden", "El retorno de Maul", "El asedio de Mandalore"],
    color: "#4de0c1",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=2200&q=90",
    glyph: "CW",
  },
  {
    id: "ep3",
    eyebrow: "Episodio III · La venganza de los Sith",
    title: "La caída",
    year: "19 ABY",
    era: "Nace el Imperio",
    copy: "Aterrorizado por perder a Padmé, Anakin se entrega a Darth Sidious. La Orden 66 extermina a los Jedi, Obi-Wan pierde a su hermano y los gemelos Luke y Leia son ocultados en extremos opuestos de la galaxia.",
    quote: "Para salvar lo que ama, Anakin destruye todo lo que era.",
    beats: ["Orden 66", "Duelo en Mustafar", "Nace Darth Vader"],
    color: "#ff563d",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90",
    imagePosition: "center 65%",
    glyph: "III",
  },
  {
    id: "obi-wan",
    eyebrow: "Obi-Wan Kenobi · Serie",
    title: "La última esperanza",
    year: "9 ABY",
    era: "Diez años bajo el Imperio",
    copy: "Roto y escondido en Tatooine, Obi-Wan vuelve a la lucha para rescatar a una joven Leia. Su viaje lo obliga a enfrentar a Vader, aceptar que Anakin se ha ido y recuperar la fe necesaria para proteger el futuro.",
    quote: "El maestro perdido vuelve a escuchar a la Fuerza.",
    beats: ["Leia es secuestrada", "La red clandestina", "Obi-Wan enfrenta a Vader"],
    color: "#ffbc69",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=2200&q=90",
    glyph: "OW",
  },
  {
    id: "rebels",
    eyebrow: "Star Wars Rebels · Serie",
    title: "La chispa rebelde",
    year: "5—0 ABY",
    era: "La rebelión encuentra su voz",
    copy: "Ezra Bridger se une a la tripulación del Fantasma: Hera, Kanan, Sabine, Zeb y Chopper. Sus pequeñas victorias conectan células dispersas, mientras Thrawn acecha y Lothal se convierte en símbolo de resistencia.",
    quote: "Antes de la Alianza hubo una familia que decidió no huir.",
    beats: ["La tripulación del Fantasma", "Ahsoka contra Vader", "Liberación de Lothal"],
    color: "#ef7dff",
    image: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=2200&q=90",
    glyph: "R",
  },
  {
    id: "ep4",
    eyebrow: "Episodio IV · Una nueva esperanza",
    title: "La chispa se enciende",
    year: "0 ABY",
    era: "La Estrella de la Muerte",
    copy: "Leia entrega a R2-D2 los planos que pueden cambiarlo todo. Luke deja Tatooine, conoce a Han Solo y acepta su primer paso hacia la Fuerza. Sobre Yavin, un disparo imposible devuelve la esperanza a la galaxia.",
    quote: "Un granjero mira dos soles y el destino responde.",
    beats: ["Los planos robados", "El sacrificio de Obi-Wan", "Victoria en Yavin"],
    color: "#68a8ff",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=2200&q=90",
    glyph: "IV",
  },
  {
    id: "ep5",
    eyebrow: "Episodio V · El Imperio contraataca",
    title: "La verdad oscura",
    year: "3 DBY",
    era: "El Imperio responde",
    copy: "Tras la caída de Hoth, Luke busca a Yoda en Dagobah mientras Han y Leia huyen hacia una trampa. En Bespin, Vader revela que el enemigo al que Luke debe vencer es también el padre que creía perdido.",
    quote: "La mayor batalla no ocurre entre estrellas, sino dentro de Luke.",
    beats: ["Batalla de Hoth", "El entrenamiento de Yoda", "La revelación de Vader"],
    color: "#a9d7ff",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2200&q=90",
    glyph: "V",
  },
  {
    id: "ep6",
    eyebrow: "Episodio VI · El retorno del Jedi",
    title: "El regreso",
    year: "4 DBY",
    era: "La profecía se cumple",
    copy: "La Alianza ataca la segunda Estrella de la Muerte. Luke se niega a odiar; su compasión despierta a Anakin, que destruye a Sidious y salva a su hijo. En Endor, la galaxia celebra el fin de una era.",
    quote: "Luke vence cuando decide no luchar como su enemigo.",
    beats: ["Rescate en Tatooine", "Batalla de Endor", "Redención de Anakin"],
    color: "#7dff9b",
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2200&q=90",
    glyph: "VI",
  },
];

function Starfield({ warp }: { warp: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    const stars = Array.from({ length: 230 }, () => ({
      x: (Math.random() - 0.5) * 1800,
      y: (Math.random() - 0.5) * 1000,
      z: Math.random() * 1200 + 1,
      pz: 1200,
    }));

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      const speed = warp ? 24 : 2.4;
      for (const star of stars) {
        star.pz = star.z;
        star.z -= speed;
        if (star.z < 1) {
          star.z = 1200;
          star.pz = 1200;
          star.x = (Math.random() - 0.5) * 1800;
          star.y = (Math.random() - 0.5) * 1000;
        }
        const sx = (star.x / star.z) * 520 + width / 2;
        const sy = (star.y / star.z) * 520 + height / 2;
        const px = (star.x / star.pz) * 520 + width / 2;
        const py = (star.y / star.pz) * 520 + height / 2;
        const alpha = Math.min(1, (1200 - star.z) / 620);
        context.beginPath();
        context.moveTo(px, py);
        context.lineTo(sx, sy);
        context.strokeStyle = `rgba(215,235,255,${alpha})`;
        context.lineWidth = warp ? Math.max(0.7, (1200 - star.z) / 180) : 1;
        context.stroke();
      }
      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [warp]);

  return <canvas className="starfield" ref={canvasRef} aria-hidden="true" />;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [warp, setWarp] = useState(true);
  const [sound, setSound] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const total = chapters.length + 1;

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-slide]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(Number((visible.target as HTMLElement).dataset.slide));
      },
      { threshold: [0.45, 0.65, 0.85] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(Math.min(active + 1, total - 1));
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(Math.max(active - 1, 0));
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, total]);

  useEffect(() => {
    const timer = window.setTimeout(() => setWarp(false), 1250);
    return () => window.clearTimeout(timer);
  }, [active]);

  const goTo = (index: number) => {
    setWarp(true);
    document.querySelector<HTMLElement>(`[data-slide="${index}"]`)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSound = () => {
    if (sound) {
      oscillatorRef.current?.stop();
      oscillatorRef.current = null;
      audioRef.current?.close();
      audioRef.current = null;
      setSound(false);
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioCtx();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = 42;
    gain.gain.value = 0.018;
    filter.type = "lowpass";
    filter.frequency.value = 135;
    oscillator.connect(filter).connect(gain).connect(audio.destination);
    oscillator.start();
    audioRef.current = audio;
    oscillatorRef.current = oscillator;
    setSound(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    event.currentTarget.style.setProperty("--mx", x.toFixed(3));
    event.currentTarget.style.setProperty("--my", y.toFixed(3));
  };

  return (
    <main className="story" onPointerMove={onPointerMove}>
      <Starfield warp={warp} />
      <div className={`warp-flash ${warp ? "is-warping" : ""}`} aria-hidden="true" />

      <header className="topbar">
        <button className="brand" onClick={() => goTo(0)} aria-label="Volver al inicio">
          <span className="brand-mark">SW</span>
          <span>ARCHIVOS DE LA FUERZA</span>
        </button>
        <div className="topbar-actions">
          <span className="chapter-counter">
            {String(active + 1).padStart(2, "0")} <i /> {String(total).padStart(2, "0")}
          </span>
          <button className={`sound-button ${sound ? "is-on" : ""}`} onClick={toggleSound} aria-label={sound ? "Desactivar sonido ambiental" : "Activar sonido ambiental"}>
            <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
            {sound ? "SONIDO ON" : "SONIDO OFF"}
          </button>
        </div>
      </header>

      <nav className="timeline" aria-label="Línea temporal">
        <div className="timeline-track"><span style={{ height: `${(active / (total - 1)) * 100}%` }} /></div>
        {Array.from({ length: total }, (_, index) => (
          <button key={index} onClick={() => goTo(index)} className={active === index ? "is-active" : ""} aria-label={index === 0 ? "Introducción" : chapters[index - 1].eyebrow}>
            <span>{index === 0 ? "00" : chapters[index - 1].glyph}</span>
          </button>
        ))}
      </nav>

      <section className="slide intro" data-slide="0">
        <div className="intro-nebula" aria-hidden="true" />
        <div className="intro-orbit orbit-one" aria-hidden="true" />
        <div className="intro-orbit orbit-two" aria-hidden="true" />
        <div className="intro-content">
          <p className="kicker"><span /> UNA HISTORIA EN DIEZ ACTOS <span /></p>
          <div className="title-lockup" aria-label="Star Wars: El legado de la Fuerza">
            <span className="title-star">STAR</span>
            <span className="title-wars">WARS</span>
          </div>
          <h1>EL LEGADO DE LA FUERZA</h1>
          <p className="intro-copy">De la inocencia de Anakin a su redención. La saga completa de los Episodios I al VI, atravesando <em>The Clone Wars</em>, <em>Obi-Wan Kenobi</em> y <em>Rebels</em>.</p>
          <button className="launch" onClick={() => goTo(1)}>
            <span>INICIAR EL VIAJE</span>
            <i aria-hidden="true">↓</i>
          </button>
          <p className="control-hint">Desliza · usa las flechas · activa el sonido</p>
        </div>
        <div className="crawl" aria-hidden="true">
          <p>Una galaxia al borde del cambio.</p>
          <p>Un niño destinado a traer equilibrio.</p>
          <p>Una familia capaz de perderlo todo y volver a encontrar la luz.</p>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <section
          className={`slide chapter chapter-${index + 1} ${active === index + 1 ? "is-active" : ""}`}
          data-slide={index + 1}
          key={chapter.id}
          style={{ "--accent": chapter.color } as React.CSSProperties}
        >
          <div
            className="scene-image"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(2,3,9,.98) 0%, rgba(2,3,9,.76) 38%, rgba(2,3,9,.12) 72%, rgba(2,3,9,.66) 100%), url('${chapter.image}')`,
              backgroundPosition: chapter.imagePosition ?? "center",
            }}
            aria-hidden="true"
          />
          <div className="scene-vignette" aria-hidden="true" />
          <div className="planet-system" aria-hidden="true">
            <div className="planet"><span>{chapter.glyph}</span></div>
            <div className="planet-ring" />
            <i className="moon moon-a" /><i className="moon moon-b" />
          </div>
          <div className="chapter-layout">
            <div className="chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <article className="chapter-card">
              <div className="chapter-meta">
                <span>{chapter.eyebrow}</span>
                <b>{chapter.year}</b>
              </div>
              <p className="era">{chapter.era}</p>
              <h2>{chapter.title}</h2>
              <p className="chapter-copy">{chapter.copy}</p>
              <blockquote>“{chapter.quote}”</blockquote>
              <div className="beats">
                {chapter.beats.map((beat, beatIndex) => (
                  <div key={beat}>
                    <span>{String(beatIndex + 1).padStart(2, "0")}</span>
                    <p>{beat}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
          <div className="data-strip" aria-hidden="true">
            <span>ARCHIVO {chapter.glyph}</span><i />
            <span>COORD {String(1138 + index * 47).padStart(4, "0")}</span><i />
            <span>FUERZA {index < 3 ? "EN ASCENSO" : index < 6 ? "EN SOMBRA" : "DESPIERTA"}</span>
          </div>
          <button className="next-slide" onClick={() => goTo(index === chapters.length - 1 ? 0 : index + 2)}>
            <span>{index === chapters.length - 1 ? "REPETIR VIAJE" : "SIGUIENTE CAPÍTULO"}</span>
            <i>{index === chapters.length - 1 ? "↺" : "↓"}</i>
          </button>
        </section>
      ))}

      <div className="grain" aria-hidden="true" />
    </main>
  );
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
