"use client";

import { useEffect, useRef, useState } from "react";
import { chapters, majorChapters } from "./story";

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
  const activeScene = active > 0 ? chapters[active - 1] : null;

  const goTo = (index: number) => {
    setWarp(true);
    document.querySelector<HTMLElement>(`[data-slide="${index}"]`)?.scrollIntoView({ behavior: "smooth" });
  };

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
    const timer = window.setTimeout(() => setWarp(false), 1100);
    return () => window.clearTimeout(timer);
  }, [active]);

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

      <nav className="timeline" aria-label="Capítulos principales">
        <div className="timeline-track"><span style={{ height: `${(active / (total - 1)) * 100}%` }} /></div>
        <button onClick={() => goTo(0)} className={active === 0 ? "is-active" : ""} aria-label="Introducción"><span>00</span></button>
        {majorChapters.map((major) => {
          const target = chapters.findIndex((chapter) => chapter.group === major.id) + 1;
          return (
            <button key={major.id} onClick={() => goTo(target)} className={activeScene?.group === major.id ? "is-active" : ""} aria-label={major.label}>
              <span>{major.glyph}</span>
            </button>
          );
        })}
      </nav>

      <section className="slide intro" data-slide="0">
        <div className="intro-nebula" aria-hidden="true" />
        <div className="intro-orbit orbit-one" aria-hidden="true" />
        <div className="intro-orbit orbit-two" aria-hidden="true" />
        <div className="intro-content">
          <p className="kicker"><span /> UNA HISTORIA EN {chapters.length} ARCHIVOS <span /></p>
          <div className="title-lockup" aria-label="Star Wars: El legado de la Fuerza">
            <span className="title-star">STAR</span>
            <span className="title-wars">WARS</span>
          </div>
          <h1>EL LEGADO DE LA FUERZA</h1>
          <p className="intro-copy">Una narración extensa de los Episodios I al VI y <em>Obi-Wan Kenobi</em>, con archivos especiales dedicados a Rex y Ahsoka dentro de <em>The Clone Wars</em> y <em>Rebels</em>.</p>
          <button className="launch" onClick={() => goTo(1)}><span>INICIAR EL VIAJE</span><i aria-hidden="true">↓</i></button>
          <p className="control-hint">Desliza · usa las flechas · selecciona una era</p>
        </div>
        <div className="crawl" aria-hidden="true">
          <p>Una galaxia al borde del cambio.</p>
          <p>Un niño destinado a traer equilibrio.</p>
          <p>Una familia capaz de perderlo todo y volver a encontrar la luz.</p>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <section className={`slide chapter ${chapter.focus ? "has-focus" : ""} ${active === index + 1 ? "is-active" : ""}`} data-slide={index + 1} key={chapter.id} style={{ "--accent": chapter.color } as React.CSSProperties}>
          <div className="scene-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,3,9,.98) 0%, rgba(2,3,9,.78) 42%, rgba(2,3,9,.12) 75%, rgba(2,3,9,.66) 100%), url('${chapter.image}')`, backgroundPosition: chapter.imagePosition ?? "center" }} aria-hidden="true" />
          <div className="scene-vignette" aria-hidden="true" />
          <div className="planet-system" aria-hidden="true">
            <div className="planet"><span>{chapter.glyph}</span></div><div className="planet-ring" /><i className="moon moon-a" /><i className="moon moon-b" />
          </div>
          <div className="chapter-layout">
            <div className="chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <article className="chapter-card">
              <div className="chapter-meta"><span>{chapter.eyebrow}</span><b>{chapter.year}</b></div>
              {chapter.focus && <p className="detail-badge"><span>ARCHIVO PRIORITARIO</span> {chapter.focus}</p>}
              <p className="era">{chapter.era}</p>
              <h2>{chapter.title}</h2>
              <div className="story-text">{chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
              <blockquote>“{chapter.quote}”</blockquote>
              <div className="beats">{chapter.beats.map((beat, beatIndex) => <div key={beat}><span>{String(beatIndex + 1).padStart(2, "0")}</span><p>{beat}</p></div>)}</div>
            </article>
          </div>
          <div className="data-strip" aria-hidden="true"><span>ARCHIVO {String(index + 1).padStart(2, "0")}</span><i /><span>{chapter.group.toUpperCase()}</span><i /><span>{chapter.focus ? `FOCO ${chapter.focus}` : "RELATO DETALLADO"}</span></div>
          <button className="next-slide" onClick={() => goTo(index === chapters.length - 1 ? 0 : index + 2)}><span>{index === chapters.length - 1 ? "REPETIR VIAJE" : "CONTINUAR RELATO"}</span><i>{index === chapters.length - 1 ? "↺" : "↓"}</i></button>
        </section>
      ))}

      <div className="grain" aria-hidden="true" />
    </main>
  );
}

declare global {
  interface Window { webkitAudioContext: typeof AudioContext; }
}
