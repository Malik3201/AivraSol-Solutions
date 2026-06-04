"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function Counter({
  value,
  suffix = "",
  active,
}: {
  value: number;
  suffix?: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!active || reduce) {
      setCount(value);
      return;
    }
    let frame = 0;
    const total = 24;
    const step = value / total;
    const id = window.setInterval(() => {
      frame += 1;
      setCount(Math.min(value, Math.round(step * frame)));
      if (frame >= total) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [active, reduce, value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function TeamProfileStats({
  skillsCount,
  projectsCount,
  className,
}: {
  skillsCount: number;
  projectsCount: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { label: "Core skills", value: Math.max(skillsCount, 4), suffix: "+" },
    { label: "Studio projects", value: projectsCount, suffix: "+" },
    { label: "Client satisfaction", value: 98, suffix: "%" },
    { label: "Years in digital", value: 5, suffix: "+" },
  ];

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-4",
        className,
      )}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-5 text-center backdrop-blur-sm"
        >
          <p className="text-2xl font-semibold tabular-nums text-primary">
            <Counter value={s.value} suffix={s.suffix} active={inView} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
