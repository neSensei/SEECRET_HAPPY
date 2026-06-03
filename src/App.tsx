/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';
import HeartScene from './HeartScene';

/* ════════════════════════════════════════
   TYPEWRITER
════════════════════════════════════════ */
const Typewriter = ({
  lines,
  delay = 30,
  onComplete,
}: {
  lines: string[];
  delay?: number;
  onComplete?: () => void;
}) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      if (currentCharIndex < lines[currentLineIndex].length) {
        const t = setTimeout(() => {
          setDisplayedLines((prev) => {
            const n = [...prev];
            if (!n[currentLineIndex]) n[currentLineIndex] = '';
            n[currentLineIndex] += lines[currentLineIndex][currentCharIndex];
            return n;
          });
          setCurrentCharIndex((p) => p + 1);
        }, delay + Math.random() * 20);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setCurrentLineIndex((p) => p + 1);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(t);
      }
    } else {
      onComplete?.();
    }
  }, [currentLineIndex, currentCharIndex, lines, delay, onComplete]);

  return (
    <div className="font-mono flex flex-col items-start text-left w-full overflow-hidden">
      {displayedLines.map((line, i) => (
        <div
          key={i}
          className="whitespace-pre-wrap break-all text-[10px] sm:text-xs md:text-sm leading-relaxed"
        >
          {line}
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <div className="w-2 h-3 sm:h-4 bg-pink-deep animate-pulse mt-1 inline-block" />
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   LOADING SEQUENCE
════════════════════════════════════════ */
const LoadingSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    'OVERCLOCKING MATRICES...',
    'FLUSHING KERNEL CACHE...',
    'RENDERING 3D_CORE...',
    'INJECTING EMOTIONAL_DATA...',
    'STABILIZING LIGHT_REFRACTIONS...',
    'COMPILING GEOMETRY...',
    'LOAD_COMPLETE!',
  ];

  useEffect(() => {
    const total = 1800, step = 20, steps = total / step;
    let cur = 0;
    const iv = setInterval(() => {
      cur++;
      setProgress(Math.min(Math.floor((cur / steps) * 100), 100));
      if (cur % 10 === 0) setLogIndex((p) => Math.min(p + 1, logs.length - 1));
      if (cur >= steps) { clearInterval(iv); setTimeout(onComplete, 200); }
    }, step);
    return () => clearInterval(iv);
  }, [onComplete]);

  const bar = (total = 14) => {
    const f = Math.floor((progress / 100) * total);
    return `[${'█'.repeat(f)}${'-'.repeat(total - f)}]`;
  };

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      className="w-full max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8 font-mono text-pink-soft z-20 glass-panel rounded-lg border border-pink-deep/30"
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="text-sm sm:text-xl font-bold tracking-widest text-pink-deep neon-pink truncate">
          SYSTEM.OVERRIDE_INITIATED
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] sm:text-sm gap-2">
            <span className="truncate">{logs[logIndex]}</span>
            <span className="shrink-0">{progress}%</span>
          </div>
          <div className="text-xs sm:text-base tracking-widest text-pink-deep opacity-80 break-all">
            {bar()}
          </div>
        </div>
        <div className="text-[9px] sm:text-xs opacity-50 leading-relaxed animate-pulse">
          <div>0x1A4F: Allocating VRAM... SUCCESS</div>
          <div>0x1A50: Injecting shaders... SUCCESS</div>
          <div>0x1A51: Refraction calc... {progress > 50 ? 'SUCCESS' : 'PENDING'}</div>
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   COUNTDOWN
════════════════════════════════════════ */
const CountdownSequence = ({ onComplete }: { onComplete: () => void }) => {
  const TARGET = useMemo(() => new Date('2026-06-23T00:00:00').getTime(), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const tick = () => {
      const d = TARGET - Date.now();
      if (d <= 0) {
        setIsPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsPassed(false);
        setTimeLeft({
          days: Math.floor(d / 86400000),
          hours: Math.floor((d % 86400000) / 3600000),
          minutes: Math.floor((d % 3600000) / 60000),
          seconds: Math.floor((d % 60000) / 1000),
        });
      }
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [TARGET]);

  const pad = (n: number) => String(n).padStart(2, '0');
  const pad3 = (n: number) => String(n).padStart(3, '0');

  const units = [
    { v: pad3(timeLeft.days), label: 'Days' },
    { v: pad(timeLeft.hours), label: 'Hrs' },
    { v: pad(timeLeft.minutes), label: 'Min' },
    { v: pad(timeLeft.seconds), label: 'Sec' },
  ];

  return (
    <motion.div
      key="countdown"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-2xl mx-auto px-4 sm:px-8 py-6 sm:py-8 font-mono text-pink-soft z-20 glass-panel rounded-lg border border-pink-deep/30 flex flex-col items-center text-center shadow-[0_0_30px_rgba(255,77,109,0.15)]"
    >
      <div className="flex flex-col gap-4 sm:gap-8 w-full">
        <div className="flex flex-col gap-1 text-left uppercase tracking-widest text-[9px] sm:text-xs opacity-80 border-b border-pink-soft/20 pb-3">
          <div>[SECURITY_LOCK: ACTIVE]</div>
          <div>[TARGET_DATE: 2026-06-23]</div>
          <div className="text-pink-deep drop-shadow-[0_0_5px_rgba(255,77,109,0.5)] break-words">
            [STATUS:{' '}
            {isPassed ? 'TEMPORAL_ALIGNMENT_ACHIEVED' : 'WAITING_FOR_TEMPORAL_ALIGNMENT'}]
          </div>
        </div>

        <div className="flex justify-center items-center gap-1 sm:gap-3">
          {units.map((u, i, arr) => (
            <React.Fragment key={u.label}>
              <div className="flex flex-col items-center min-w-0">
                <span className="text-[clamp(1.4rem,7vw,3.75rem)] font-bold tracking-wider text-pink-deep drop-shadow-[0_0_15px_rgba(255,77,109,0.5)] leading-none tabular-nums">
                  {u.v}
                </span>
                <span className="text-[8px] sm:text-[10px] mt-1 opacity-50 tracking-widest uppercase text-pink-soft">
                  {u.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span className="text-xl sm:text-4xl opacity-50 text-pink-soft self-start leading-none">:</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="pt-3 border-t border-pink-soft/20 flex justify-center min-h-[52px] items-center">
          {isPassed ? (
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(); }}
              className="group relative flex items-center justify-center w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 border-2 border-pink-deep hover:bg-pink-deep/20 active:bg-pink-deep/30 transition-all rounded-sm backdrop-blur-sm shadow-[0_0_15px_rgba(255,77,109,0.3)] cursor-pointer"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="relative z-10 text-[10px] sm:text-sm font-bold tracking-[0.12em] sm:tracking-[0.18em] text-pink-deep group-hover:text-white transition-colors">
                ACCESS_GRANTED // DEPLOY_PROTOCOL
              </span>
            </button>
          ) : (
            <span className="text-[9px] sm:text-xs tracking-widest opacity-40 uppercase text-pink-soft text-center px-2">
              [ TEMPORAL_LOCK_ENGAGED // ACCESS_DENIED ]
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   MESSAGE OVERLAY
════════════════════════════════════════ */
const MessageOverlay = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-auto"
  >
    {/* backdrop */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* карточка: снизу вверх на мобильных, по центру на десктопе */}
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      className="
        relative z-10
        w-full sm:w-auto sm:max-w-lg sm:mx-4
        glass-panel
        rounded-t-3xl sm:rounded-2xl
        border border-pink-soft/40
        shadow-[0_-4px_40px_rgba(255,77,109,0.2)]
        bg-[#050505]/90
        backdrop-blur-2xl
        flex flex-col
        max-h-[85dvh] sm:max-h-[78vh]
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* drag handle — только мобильные */}
      <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
        <div className="w-10 h-1 rounded-full bg-pink-soft/30" />
      </div>

      {/* заголовок */}
      <div className="flex items-center justify-between px-5 pt-3 sm:pt-5 pb-3 border-b border-pink-soft/10 shrink-0">
        <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.22em] uppercase text-pink-deep opacity-80">
          // BIRTHDAY_MESSAGE.decrypt
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="
            text-pink-soft/50 hover:text-pink-deep active:text-pink-deep
            transition-colors text-lg leading-none ml-3 shrink-0
            w-7 h-7 flex items-center justify-center rounded-sm
            hover:bg-pink-deep/10
          "
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          ✕
        </button>
      </div>

      {/* тело со скроллом */}
      <div className="overflow-y-auto custom-scrollbar px-5 py-4 sm:px-6 sm:py-5 flex-1">
        <p className="font-mono text-[11px] sm:text-sm leading-[1.9] text-pink-soft font-medium tracking-wide">
          <span className="text-pink-deep font-bold">{'>'}</span> С днем рождения!
          <br /><br />
          Сегодня твоя личная система совершила успешный апгрейд до новой, еще более крутой версии!
          <br /><br />
          Желаю тебе:
          <br /><br />
          <span className="text-pink-deep font-bold">Идеального кода судьбы:</span>{' '}
          чтобы в твоей жизни все шло по плану, компилировалось с первого раза и без единой ошибки.
          <br /><br />
          <span className="text-pink-deep font-bold">Никаких багов:</span>{' '}
          пусть мелкие неприятности автоматически отправляются в корзину, а на душе всегда будет стабильный аптайм — то есть отличное настроение 24/7.
          <br /><br />
          <span className="text-pink-deep font-bold">Только крутых фич:</span>{' '}
          пусть каждый день добавляет в твою жизнь новые классные обновления — путешествия, яркие эмоции, любовь и верных друзей.
          <br /><br />
          <span className="text-pink-deep font-bold">Безлимитного кэша:</span>{' '}
          и в плане приятных воспоминаний, и на банковской карте!
          <br /><br />
          Пусть твой внутренний процессор никогда не перегревается, а вокруг будут только те люди, с которыми у тебя идеальный коннект! С праздником!
          <br /><br />
          <span className="text-pink-deep font-bold text-center block w-full text-base sm:text-lg">&lt;3</span>
        </p>
      </div>

      {/* футер */}
      <div className="shrink-0 px-5 py-3 sm:py-4 border-t border-pink-soft/10 flex justify-center">
        <button
          onClick={onClose}
          className="
            w-full sm:w-auto px-8 py-2.5
            border border-pink-deep/50 rounded-sm
            text-[10px] sm:text-xs font-mono tracking-widest uppercase
            text-pink-deep hover:bg-pink-deep/20 active:bg-pink-deep/30
            transition-all
          "
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          [ close_terminal ]
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ════════════════════════════════════════
   APP
════════════════════════════════════════ */
export default function App() {
  const [stage, setStage] = useState<'countdown' | 'console' | 'loading' | 'reveal'>('countdown');
  const [consoleFinished, setConsoleFinished] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);

  /* единый обработчик для ПК и мобильных */
  const handleHeartClick = () => setMsgOpen((prev) => !prev);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#050505] text-pink-soft font-mono selection:bg-brand-red/30 overflow-hidden">
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-pink-soft/10 via-transparent to-transparent opacity-30 pointer-events-none z-0" />

      {/* не-reveal этапы */}
      <div className="w-full px-3 sm:px-6 flex flex-col items-center z-10">
        <AnimatePresence mode="wait">

          {stage === 'countdown' && (
            <CountdownSequence onComplete={() => setStage('console')} />
          )}

          {stage === 'console' && (
            <motion.div
              key="console"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full max-w-2xl px-4 sm:px-8 py-6 sm:py-8 font-mono text-pink-soft z-20 glass-panel rounded-lg border border-white/10"
            >
              <div className="space-y-4">
                <div className="w-full overflow-hidden text-pink-soft/80">
                  <Typewriter
                    lines={[
                      "import { Heart } from '@organic-digital/core';",
                      "const connection = await establishLink({ secure: true });",
                      "decryptingPackage(id: 'SEECRET_HAPPY')...",
                      '[SUCCESS] Bypass complete. Ready to render.',
                    ]}
                    delay={20}
                    onComplete={() => setConsoleFinished(true)}
                  />
                </div>

                <div className="h-6 flex items-center">
                  {consoleFinished && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-pink-deep neon-pink text-sm"
                    >
                      {'>'} READY_
                    </motion.span>
                  )}
                </div>

                {consoleFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-5 sm:pt-8 flex flex-col items-center gap-4 border-t border-pink-soft/20"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); setStage('loading'); }}
                      className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 border-2 border-pink-deep hover:bg-pink-deep/20 active:bg-pink-deep/30 transition-all rounded-sm backdrop-blur-sm shadow-[0_0_15px_rgba(255,77,109,0.3)] cursor-pointer"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <span className="relative flex items-center gap-2 text-[10px] sm:text-base font-bold tracking-[0.12em] sm:tracking-[0.2em] group-hover:text-white text-pink-soft">
                        <Terminal size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
                        INITIATE_BIRTHDAY_SEQUENCE
                      </span>
                    </button>
                    <p className="text-[9px] text-pink-soft/40 tracking-widest animate-pulse text-center">
                      TERMINAL_ID: AX-7792 | SESSION: RO_BIRTHDAY_SCENE
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {stage === 'loading' && (
            <LoadingSequence onComplete={() => setStage('reveal')} />
          )}

        </AnimatePresence>
      </div>

      {/* ── REVEAL — полноэкранный слой ── */}
      <AnimatePresence>
        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            {/* 3-D сцена — теперь получает единый колбэк onClick */}
            <HeartScene
              onHeartClick={handleHeartClick}
              msgOpen={msgOpen}
            />

            {/* оверлей с поздравлением */}
            <AnimatePresence>
              {msgOpen && <MessageOverlay onClose={() => setMsgOpen(false)} />}
            </AnimatePresence>

            {/* HAPPY BIRTHDAY */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2, duration: 1.5 }}
              className="
                z-20 text-center pointer-events-none
                absolute
                top-[10%] sm:top-1/2
                left-1/2
                -translate-x-1/2 sm:-translate-y-1/2
              "
            >
              <h1 className="
                text-pink-deep font-mono font-black neon-pink leading-tight
                uppercase drop-shadow-2xl
                text-[clamp(1.5rem,7.5vw,3.75rem)]
                tracking-[0.15em] sm:tracking-[0.2em]
                mb-1
              ">
                HAPPY<br />BIRTHDAY
              </h1>
              <div className="text-[9px] sm:text-[10px] tracking-[0.35em] opacity-80 mt-2 text-pink-soft">
                PROTOCOL_EXECUTED
              </div>
            </motion.div>

            {/* HUD top-left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="
                absolute top-3 sm:top-8 left-3 sm:left-8
                z-20 pointer-events-none
                glass-panel p-2 sm:p-4 rounded-sm
                border-l-2 border-l-pink-deep
                max-w-[48vw] sm:max-w-none
              "
            >
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-deep rounded-full animate-pulse shrink-0" />
                <span className="text-[7px] sm:text-xs font-bold uppercase tracking-widest text-pink-soft leading-tight">
                  Status: Active
                </span>
              </div>
              <div className="text-[6px] sm:text-[10px] opacity-60 text-pink-soft uppercase leading-relaxed">
                KERNEL: BDAY.V3.0<br />
                LOC: SECTOR_CELEBRATION<br />
                STATUS: DECRYPTING_JOY
              </div>
            </motion.div>

            {/* HUD top-right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="
                absolute top-3 sm:top-8 right-3 sm:right-8
                z-20 pointer-events-none
                glass-panel p-2 sm:p-4 rounded-sm
                text-right flex-col
                border-r-2 border-r-pink-deep
                hidden sm:flex
              "
            >
              <div className="text-xs uppercase tracking-tighter mb-1 opacity-80 text-pink-soft">
                Target Identification
              </div>
              <div className="text-xl font-bold neon-pink text-pink-deep leading-tight">
                USER_HAPPINESS: 100%
              </div>
              <div className="text-[10px] opacity-60 mt-1 text-pink-soft">
                ENCRYPTION: NULL | AGE_INC: ++1
              </div>
            </motion.div>

            {/* bottom decoration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="
                absolute bottom-16 sm:bottom-14
                w-full flex items-center justify-center
                gap-2 sm:gap-4 z-20 pointer-events-none px-4
              "
            >
              <div className="w-6 sm:w-32 h-px bg-pink-deep/40 shrink-0" />
              <div className="text-[7px] sm:text-[10px] tracking-widest opacity-60 text-pink-soft text-center">
                INITIALIZING HOLOGRAPHIC_CORE
              </div>
              <div className="w-6 sm:w-32 h-px bg-pink-deep/40 shrink-0" />
            </motion.div>

            {/* revert */}
            <div className="
              absolute bottom-4 sm:bottom-6 left-3 sm:left-8
              z-20 pointer-events-auto
              glass-panel p-1 sm:p-2 rounded-sm
              border-l-2 border-l-pink-deep
              hover:bg-pink-deep/20 active:bg-pink-deep/30
              transition-all cursor-pointer
            ">
              <button
                onClick={(e) => { e.stopPropagation(); setStage('console'); setMsgOpen(false); }}
                className="text-pink-soft hover:text-white px-2 sm:px-3 py-1 uppercase text-[9px] sm:text-xs tracking-widest font-mono flex items-center gap-1 sm:gap-2"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Terminal size={10} />
                <span>[Revert]</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}