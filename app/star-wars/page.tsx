"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { chapters, majorChapters, site, type StoryPanel } from "../story";

const INITIAL_VOLUME = 0.55;

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

function StorySequence({
  panels,
  chapterTitle,
  isActive,
}: {
  panels: StoryPanel[];
  chapterTitle: string;
  isActive: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentPanel, setCurrentPanel] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    trackRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [isActive]);

  const goToPanel = (index: number) => {
    const nextPanel = Math.max(0, Math.min(index, panels.length - 1));
    const track = trackRef.current;
    const target = track?.children[nextPanel] as HTMLElement | undefined;
    if (!track || !target) return;
    track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    setCurrentPanel(nextPanel);
  };

  const updateCurrentPanel = () => {
    const track = trackRef.current;
    if (!track) return;
    const panelElements = Array.from(track.children) as HTMLElement[];
    const closest = panelElements.reduce(
      (best, panel, index) => {
        const distance = Math.abs(panel.offsetLeft - track.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    setCurrentPanel(closest.index);
  };

  return (
    <section className="story-sequence" aria-label={`Secuencia visual de ${chapterTitle}`}>
      <div className="story-sequence-head">
        <div>
          <span>SECUENCIA VISUAL</span>
          <p>Desliza la historia hacia la derecha</p>
        </div>
        <div className="story-sequence-controls">
          <output aria-live="polite">{String(currentPanel + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}</output>
          <button type="button" onClick={() => goToPanel(currentPanel - 1)} disabled={currentPanel === 0} aria-label="Momento anterior">←</button>
          <button type="button" onClick={() => goToPanel(currentPanel + 1)} disabled={currentPanel === panels.length - 1} aria-label="Momento siguiente">→</button>
        </div>
      </div>
      <div className="story-sequence-track" ref={trackRef} onScroll={updateCurrentPanel}>
        {panels.map((panel, panelIndex) => (
          <figure className="story-panel" key={`${panel.title}-${panelIndex}`}>
            <div className="story-panel-image">
              <Image
                src={panel.image}
                alt={panel.title}
                fill
                sizes="(max-width: 620px) 84vw, 290px"
                unoptimized
                style={{ objectPosition: panel.imagePosition ?? "center", objectFit: panel.imageFit ?? "cover" }}
              />
              <span>{String(panelIndex + 1).padStart(2, "0")}</span>
            </div>
            <figcaption>
              <p className="story-panel-eyebrow">{panel.eyebrow}</p>
              <h3>{panel.title}</h3>
              <p>{panel.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [warp, setWarp] = useState(true);
  const [sound, setSound] = useState(false);
  const [volume, setVolume] = useState(INITIAL_VOLUME);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = INITIAL_VOLUME;

    const removePlaybackUnlock = () => {
      window.removeEventListener("pointerdown", unlockPlayback);
      window.removeEventListener("keydown", unlockPlayback);
    };

    const startPlayback = async () => {
      try {
        await audio.play();
        removePlaybackUnlock();
      } catch (error) {
        if (error instanceof DOMException && error.name === "NotAllowedError") {
          window.addEventListener("pointerdown", unlockPlayback, { once: true });
          window.addEventListener("keydown", unlockPlayback, { once: true });
        }
      }
    };

    function unlockPlayback() {
      void startPlayback();
    }

    void startPlayback();

    return () => {
      removePlaybackUnlock();
      audio.pause();
    };
  }, []);

  const toggleSound = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setSound(false);
    }
  };

  const changeVolume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    event.currentTarget.style.setProperty("--mx", x.toFixed(3));
    event.currentTarget.style.setProperty("--my", y.toFixed(3));
  };

  const onPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--mx", "0");
    event.currentTarget.style.setProperty("--my", "0");
  };

  return (
    <main className="story" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {/* Background music has no spoken content to caption. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src="/audio/star-wars-theme.mp3"
        preload="auto"
        loop
        onPlay={() => setSound(true)}
        onPause={() => setSound(false)}
      />
      <Starfield warp={warp} />
      <div className={`warp-flash ${warp ? "is-warping" : ""}`} aria-hidden="true" />

      <header className="topbar">
        <button className="brand" onClick={() => goTo(0)} aria-label="Volver al inicio">
          <span className="brand-mark">{site.brandShort}</span>
          <span>{site.brand}</span>
        </button>
        <div className="topbar-actions">
          <span className="chapter-counter">
            {String(active + 1).padStart(2, "0")} <i /> {String(total).padStart(2, "0")}
          </span>
          <div className="audio-controls">
            <button className={`sound-button ${sound ? "is-on" : ""}`} onClick={toggleSound} aria-label={sound ? "Pausar tema musical" : "Reproducir tema musical"}>
              <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
              {sound ? "SONIDO ON" : "SONIDO OFF"}
            </button>
            <label className="volume-control">
              <span>VOLUMEN</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={changeVolume}
                aria-label="Volumen del tema musical"
                aria-valuetext={`${Math.round(volume * 100)}%`}
                style={{ "--volume": `${volume * 100}%` } as React.CSSProperties}
              />
            </label>
          </div>
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
          <div className="title-lockup" aria-label={site.metadataTitle}>
            <div className="title-logo" aria-hidden="true">
              <span className="title-line title-star">{site.titleLine1}</span>
              <span className="title-line title-wars">{site.titleLine2}</span>
            </div>
          </div>
          <h1>{site.subtitle}</h1>
          <button className="launch" onClick={() => goTo(1)}><span>{site.launchLabel}</span><i aria-hidden="true">↓</i></button>
          <p className="control-hint">{site.controlHint}</p>
        </div>
        <div className="crawl" aria-hidden="true">
          {site.crawl.map((line) => <p key={line}>{line}</p>)}
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <section className={`slide chapter ${chapter.focus ? "has-focus" : ""} ${active === index + 1 ? "is-active" : ""}`} data-slide={index + 1} key={chapter.id} style={{ "--accent": chapter.color } as React.CSSProperties}>
          <div className="scene-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,3,9,.98) 0%, rgba(2,3,9,.78) 42%, rgba(2,3,9,.12) 75%, rgba(2,3,9,.66) 100%), url('${chapter.image}')`, backgroundPosition: chapter.imagePosition ?? "center" }} aria-hidden="true" />
          <div className="scene-vignette" aria-hidden="true" />
          <div className="planet-system" aria-hidden="true">
            <div
              className={`planet ${chapter.planetImage ? "has-image" : ""}`}
              style={chapter.planetImage ? { backgroundImage: `url('${chapter.planetImage}')` } : undefined}
            >
              <span>{chapter.glyph}</span>
            </div>
            <i className="moon moon-a" /><i className="moon moon-b" />
          </div>
          <div className="chapter-layout">
            <div className="chapter-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
            <article className={`chapter-card ${chapter.storyPanels?.length ? "has-sequence" : ""}`}>
              <span className="lightsaber-rail" aria-hidden="true" />
              <div className="chapter-meta"><span>{chapter.eyebrow}</span><b>{chapter.year}</b></div>
              {chapter.focus && <p className="detail-badge"><span>{site.priorityLabel}</span> {chapter.focus}</p>}
              <p className="era">{chapter.era}</p>
              <h2>{chapter.title}</h2>
              {chapter.storyPanels?.length ? (
                <>
                  <StorySequence panels={chapter.storyPanels} chapterTitle={chapter.title} isActive={active === index + 1} />
                  <details className="chapter-summary">
                    <summary>Leer el relato completo</summary>
                    <div className="story-text">{chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
                  </details>
                </>
              ) : (
                <div className="story-text">{chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
              )}
              <blockquote>“{chapter.quote}”</blockquote>
              <div className="beats">{chapter.beats.map((beat, beatIndex) => <div key={beat}><span>{String(beatIndex + 1).padStart(2, "0")}</span><p>{beat}</p></div>)}</div>
            </article>
          </div>
          <div className="data-strip" aria-hidden="true"><span>ARCHIVO {String(index + 1).padStart(2, "0")}</span><i /><span>{chapter.group.toUpperCase()}</span><i /><span>{chapter.focus ? `FOCO ${chapter.focus}` : site.detailedLabel}</span></div>
          <button className="next-slide" onClick={() => goTo(index === chapters.length - 1 ? 0 : index + 2)}><span>{index === chapters.length - 1 ? site.repeatLabel : site.continueLabel}</span><i>{index === chapters.length - 1 ? "↺" : "↓"}</i></button>
        </section>
      ))}

      <div className="grain" aria-hidden="true" />
    </main>
  );
}
