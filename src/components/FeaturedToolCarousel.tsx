"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Review } from "@/types/review";

const CARD_COLORS = ["#ef4444", "#f59e0b", "#38bdf8", "#a78bfa", "#34d399"];
const THICKNESS_LAYERS = [-8, -4, 0, 4, 8];

interface FeaturedToolCarouselProps {
  tools: Review[];
}

function smoothstep(value: number) {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

export function FeaturedToolCarousel({ tools }: FeaturedToolCarouselProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef(0);
  const frameRef = useRef(0);
  const dragRef = useRef({ active: false, lastX: 0, moved: false });
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [metrics, setMetrics] = useState({ cardW: 310, cardH: 206 });

  useEffect(() => {
    const updateMetrics = () => {
      const width = stageRef.current?.clientWidth ?? window.innerWidth;
      const cardW = Math.max(220, Math.min(390, Math.round(width * 0.56)));
      setMetrics({ cardW, cardH: Math.round(cardW / 1.51) });
    };

    updateMetrics();
    const observer = new ResizeObserver(updateMetrics);
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!tools.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      if (!reducedMotion && !dragRef.current.active) progressRef.current += 0.0022;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.075;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.075;

      const count = tools.length;
      for (let index = 0; index < count; index += 1) {
        const card = cardsRef.current[index];
        if (!card) continue;

        let offset = index - progressRef.current;
        while (offset > count / 2) offset -= count;
        while (offset < -count / 2) offset += count;

        const absoluteOffset = Math.abs(offset);
        if (absoluteOffset > 1.65) {
          card.style.visibility = "hidden";
          continue;
        }

        card.style.visibility = "visible";
        const side = Math.sign(offset || 1);
        const eased = smoothstep(absoluteOffset / 1.65);
        const x = side * (metrics.cardW * (0.44 + eased * 0.73));
        const z = 380 - eased * 600;
        const rotateY = -side * (absoluteOffset < 1 ? absoluteOffset * 53 : 53 + (absoluteOffset - 1) * 40);
        const centerFactor = Math.max(0, 1 - absoluteOffset);
        const tiltX = -mouseRef.current.y * 10 * centerFactor;
        const tiltY = mouseRef.current.x * 13 * centerFactor;

        card.style.opacity = String(Math.max(0, 1 - Math.max(0, absoluteOffset - 1) * 1.8));
        card.style.zIndex = String(Math.round(z));
        card.style.transform = `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${(rotateY + tiltY).toFixed(1)}deg) rotateX(${tiltX.toFixed(1)}deg)`;
      }
      frameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameRef.current);
  }, [metrics, tools.length]);

  function updatePointer(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    mouseRef.current.targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    mouseRef.current.targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));

    if (dragRef.current.active) {
      const delta = event.clientX - dragRef.current.lastX;
      if (Math.abs(delta) > 2) dragRef.current.moved = true;
      progressRef.current -= delta / Math.max(metrics.cardW, 1);
      dragRef.current.lastX = event.clientX;
    }
  }

  function beginDrag(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { active: true, lastX: event.clientX, moved: false };
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current.active = false;
  }

  return (
    <div
      ref={stageRef}
      className="relative h-[23rem] w-full touch-pan-y overflow-hidden border border-zinc-700 bg-black select-none sm:h-[27rem]"
      style={{ perspective: "1350px" }}
      onPointerDown={beginDrag}
      onPointerMove={updatePointer}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => { mouseRef.current.targetX = 0; mouseRef.current.targetY = 0; }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(239,68,68,0.12),transparent_42%)]" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {tools.map((tool, index) => {
          const accent = CARD_COLORS[index % CARD_COLORS.length];
          return (
            <Link
              key={tool.id}
              ref={(element) => { cardsRef.current[index] = element; }}
              href={`/reviews/${tool.slug}`}
              onClick={(event) => { if (dragRef.current.moved) event.preventDefault(); }}
              className="feature-carousel-card absolute block text-left outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              style={{ width: metrics.cardW, height: metrics.cardH, transformStyle: "preserve-3d", transition: "opacity 180ms ease", willChange: "transform, opacity" }}
              aria-label={`Read the ${tool.toolName} review`}
            >
              {THICKNESS_LAYERS.map((depth) => (
                <div
                  key={depth}
                  className="absolute inset-0 border border-white/20"
                  style={{ background: "#171717", borderRadius: 14, transform: `translateZ(${depth}px)` }}
                  aria-hidden="true"
                />
              ))}

              <div className="absolute inset-0 overflow-hidden border border-white/30 p-5" style={{ borderRadius: 14, transform: "translateZ(9px)", backfaceVisibility: "hidden" }}>
                <div className="absolute inset-0 opacity-90" style={{ background: `radial-gradient(circle at 18% 15%, ${accent}, transparent 38%), linear-gradient(135deg, #202020 0%, #070707 72%)` }} />
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/15" />
                <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full border border-white/10" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">Featured tool</p>
                      <h3 className="mt-2 text-2xl font-black tracking-tight text-white">{tool.toolName}</h3>
                    </div>
                    <span className="border border-emerald-400/40 bg-emerald-400/15 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">{tool.score.toFixed(1)}/10</span>
                  </div>
                  <div>
                    <p className="max-w-[85%] text-sm leading-relaxed text-white/80">{tool.summary}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.13em] text-white/55">{tool.category}</span>
                      <span className="text-xs font-bold text-white">Open review →</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 overflow-hidden border border-white/20" style={{ background: "#09090b", borderRadius: 14, transform: "translateZ(-9px) rotateY(180deg)", backfaceVisibility: "hidden" }} aria-hidden="true">
                <div className="absolute left-0 right-0 top-5 h-9 bg-black/85" />
                <div className="absolute inset-x-5 bottom-5 border-t border-white/15 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                  Rate That AI<br />Independent review record
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Drag to explore · hover to tilt</p>
    </div>
  );
}
