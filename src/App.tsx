/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';
import HeartScene from './HeartScene';

const Typewriter = ({ lines, delay = 30, onComplete }: { lines: string[], delay?: number, onComplete?: () => void }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex < lines.length) {
      if (currentCharIndex < lines[currentLineIndex].length) {
        const timeout = setTimeout(() => {
          setDisplayedLines(prev => {
            const newLines = [...prev];
            if (newLines[currentLineIndex] === undefined) {
              newLines[currentLineIndex] = '';
            }
            newLines[currentLineIndex] += lines[currentLineIndex][currentCharIndex];
            return newLines;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, delay + Math.random() * 20);
        return () => clearTimeout(timeout);
      } else {
        const lineDelay = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 300);
        return () => clearTimeout(lineDelay);
      }
    } else if (onComplete) {
      onComplete();
    }
  }, [currentLineIndex, currentCharIndex, lines, delay, onComplete]);

  return (
    <div className="font-mono flex flex-col items-start text-left">
      {displayedLines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      {currentLineIndex < lines.length && (
         <div className="w-2 h-4 bg-pink-deep animate-pulse mt-1 inline-block" />
      )}
    </div>
  );
};

const LoadingSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    "OVERCLOCKING MATRICES...",
    "FLUSHING KERNEL CACHE...",
    "RENDERING 3D_CORE...",
    "INJECTING EMOTIONAL_DATA...",
    "STABILIZING LIGHT_REFRACTIONS...",
    "COMPILING GEOMETRY...",
    "LOAD_COMPLETE!"
  ];

  useEffect(() => {
    const totalDuration = 1800;
    const intervalTime = 20;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(currentProgress);
      
      if (currentStep % 10 === 0) {
        setLogIndex((prev) => Math.min(prev + 1, logs.length - 1));
      }

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressBar = () => {
    const totalBlocks = 20;
    const filledBlocks = Math.floor((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return `[${'█'.repeat(filledBlocks)}${'-'.repeat(emptyBlocks)}]`;
  };

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      className="w-full max-w-2xl p-8 font-mono text-pink-soft z-20 glass-panel rounded-lg border border-pink-deep/30"
    >
      <div className="flex flex-col gap-6">
        <div className="text-xl font-bold tracking-widest text-pink-deep neon-pink">
          SYSTEM.OVERRIDE_INITIATED
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{logs[logIndex]}</span>
            <span>{progress}%</span>
          </div>
          <div className="text-lg tracking-widest text-pink-deep opacity-80">
            {progressBar()}
          </div>
        </div>
        
        <div className="text-xs opacity-50 mt-4 leading-relaxed animate-pulse">
            <div>0x1A4F: Allocating VRAM... SUCCESS</div>
            <div>0x1A50: Injecting shaders... SUCCESS</div>
            <div>0x1A51: Refraction calculation... {(progress > 50 ? 'SUCCESS' : 'PENDING')}</div>
        </div>
      </div>
    </motion.div>
  );
};

const CountdownSequence = ({ onComplete }: { onComplete: () => void }) => {
  const TARGET_DATE = useMemo(() => new Date('2026-06-23T00:00:00').getTime(), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        setIsPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsPassed(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [TARGET_DATE]);

  const pad = (num: number) => num.toString().padStart(2, '0');
  const padDays = (num: number) => num.toString().padStart(3, '0');

  return (
    <motion.div
      key="countdown"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-2xl p-8 font-mono text-pink-soft z-20 glass-panel rounded-lg border border-pink-deep/30 flex flex-col items-center text-center shadow-[0_0_30px_rgba(255,77,109,0.15)]"
    >
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-2 uppercase tracking-widest text-xs opacity-80 border-b border-pink-soft/20 pb-4 text-left">
          <div>[SECURITY_LOCK: ACTIVE]</div>
          <div>[TARGET_DATE: 2026-06-23]</div>
          <div className="text-pink-deep drop-shadow-[0_0_5px_rgba(255,77,109,0.5)]">
            [STATUS: {isPassed ? 'TEMPORAL_ALIGNMENT_ACHIEVED' : 'WAITING_FOR_TEMPORAL_ALIGNMENT'}]
          </div>
        </div>

        <div className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-widest text-pink-deep py-4 flex justify-center items-center gap-2 sm:gap-4 drop-shadow-[0_0_15px_rgba(255,77,109,0.5)]">
          <div className="flex flex-col items-center">
            <span>{padDays(timeLeft.days)}</span>
            <span className="text-[10px] sm:text-xs mt-2 opacity-50 tracking-widest uppercase text-pink-soft drop-shadow-none">Days</span>
          </div>
          <span className="opacity-50 pb-6 text-pink-soft drop-shadow-none">:</span>
          <div className="flex flex-col items-center">
            <span>{pad(timeLeft.hours)}</span>
            <span className="text-[10px] sm:text-xs mt-2 opacity-50 tracking-widest uppercase text-pink-soft drop-shadow-none">Hours</span>
          </div>
          <span className="opacity-50 pb-6 text-pink-soft drop-shadow-none">:</span>
          <div className="flex flex-col items-center">
            <span>{pad(timeLeft.minutes)}</span>
            <span className="text-[10px] sm:text-xs mt-2 opacity-50 tracking-widest uppercase text-pink-soft drop-shadow-none">Mins</span>
          </div>
          <span className="opacity-50 pb-6 text-pink-soft drop-shadow-none">:</span>
          <div className="flex flex-col items-center">
            <span>{pad(timeLeft.seconds)}</span>
            <span className="text-[10px] sm:text-xs mt-2 opacity-50 tracking-widest uppercase text-pink-soft drop-shadow-none">Secs</span>
          </div>
        </div>

        <div className="pt-4 border-t border-pink-soft/20 flex justify-center h-16 items-center">
          {isPassed ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="group relative flex flex-wrap items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-pink-deep hover:bg-pink-deep/20 transition-all duration-300 overflow-hidden pointer-events-auto rounded-sm backdrop-blur-sm shadow-[0_0_15px_rgba(255,77,109,0.3)] hover:shadow-[0_0_25px_rgba(255,77,109,0.5)] cursor-pointer"
            >
               <div className="absolute inset-0 bg-pink-deep opacity-0 group-hover:opacity-20 transition-opacity"></div>
               <span className="relative z-10 flex items-center justify-center w-full gap-3 text-sm sm:text-base font-bold tracking-[0.2em] text-pink-deep group-hover:text-white transition-colors duration-300">
                 ACCESS_GRANTED // DEPLOY_PROTOCOL
               </span>
            </button>
          ) : (
            <span className="text-xs sm:text-sm tracking-[0.2em] opacity-40 uppercase text-pink-soft select-none">
              [ TEMPORAL_LOCK_ENGAGED // ACCESS_DENIED ]
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [stage, setStage] = useState<'countdown' | 'console' | 'loading' | 'reveal'>('countdown');
  const [consoleFinished, setConsoleFinished] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-pink-soft font-mono selection:bg-brand-red/30 overflow-hidden"
    >
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-pink-soft/10 via-transparent to-transparent opacity-30 pointer-events-none z-0"></div>
      
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
            className="w-full max-w-2xl p-8 font-mono text-sm md:text-base text-pink-soft z-20 glass-panel rounded-lg border border-white/10"
          >
            <div className="space-y-4">
              <div className="flex gap-2 text-pink-soft/80">
                <Typewriter 
                  lines={[
                    "import { Heart } from '@organic-digital/core';",
                    "const connection = await establishLink({ secure: true });",
                    "decryptingPackage(id: 'SEECRET_HAPPY')...",
                    "[SUCCESS] Bypass complete. Ready to render."
                  ]}
                  delay={20} 
                  onComplete={() => setConsoleFinished(true)}
                />
              </div>
              
              <div className="flex gap-2 h-6">
                {consoleFinished && (
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-pink-deep neon-pink"
                    >
                        {">"} READY_
                    </motion.span>
                )}
              </div>

              {consoleFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-8 flex flex-col items-center gap-6 border-t border-pink-soft/20 mt-4"
                >
                  <button
                    id="decrypt-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStage('loading');
                    }}
                    className="group relative flex flex-wrap items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-pink-deep hover:bg-pink-deep/20 transition-all duration-300 overflow-hidden pointer-events-auto rounded-sm backdrop-blur-sm shadow-[0_0_15px_rgba(255,77,109,0.3)] hover:shadow-[0_0_25px_rgba(255,77,109,0.5)] cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-pink-deep opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <span className="relative flex items-center gap-3 text-sm sm:text-base font-bold tracking-[0.2em] group-hover:text-white text-pink-soft">
                      <Terminal size={18} className="group-hover:translate-x-1 transition-transform" />
                      INITIATE_BIRTHDAY_SEQUENCE
                    </span>
                  </button>
                  
                  <p className="text-[10px] text-pink-soft/40 tracking-widest animate-pulse mt-2">
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

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            <HeartScene onHoverChange={setIsHovered} />
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute z-30 pointer-events-none"
                >
                  <div className="glass-panel p-6 rounded-lg border border-pink-soft shadow-[0_0_20px_rgba(255,143,177,0.2)] max-w-lg text-left bg-[#050505]/40 backdrop-blur-[20px] h-[80vh] overflow-y-auto custom-scrollbar">
                    <p className="font-mono text-xs sm:text-sm leading-relaxed text-pink-soft font-medium tracking-wide">
                      <span className="text-pink-deep font-bold">{">"}</span> С днем рождения!
                      <br /><br />
                      Сегодня твоя личная система совершила успешный апгрейд до новой, еще более крутой версии!
                      <br /><br />
                      Желаю тебе:
                      <br /><br />
                      <span className="text-pink-deep font-bold drop-shadow-[0_0_5px_rgba(255,77,109,0.3)]">Идеального кода судьбы:</span> чтобы в твоей жизни все шло по плану, компилировалось с первого раза и без единой ошибки.
                      <br /><br />
                      <span className="text-pink-deep font-bold drop-shadow-[0_0_5px_rgba(255,77,109,0.3)]">Никаких багов:</span> пусть мелкие неприятности автоматически отправляются в корзину, а на душе всегда будет стабильный аптайм — то есть отличное настроение 24/7.
                      <br /><br />
                      <span className="text-pink-deep font-bold drop-shadow-[0_0_5px_rgba(255,77,109,0.3)]">Только крутых фич:</span> пусть каждый день добавляет в твою жизнь новые классные обновления — путешествия, яркие эмоции, любовь и верных друзей.
                      <br /><br />
                      <span className="text-pink-deep font-bold drop-shadow-[0_0_5px_rgba(255,77,109,0.3)]">Безлимитного кэша:</span> и в плане приятных воспоминаний, и на банковской карте!
                      <br /><br />
                      Пусть твой внутренний процессор никогда не перегревается, а вокруг будут только те люди, с которыми у тебя идеальный коннект! С праздником!
                      <br /><br />
                      <span className="text-pink-deep font-bold text-center block w-full">&lt;3</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2, duration: 1.5 }}
              className="z-20 text-center pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <h1 className="text-pink-deep font-mono text-4xl md:text-6xl font-black neon-pink leading-tight uppercase tracking-[0.2em] mb-2 drop-shadow-2xl">
                HAPPY<br/>BIRTHDAY
              </h1>
              <div className="text-[10px] tracking-[0.5em] opacity-80 mt-4 text-pink-soft">PROTOCOL_EXECUTED</div>
            </motion.div>

            {/* HUD Overlays */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1, duration: 1 }}
               className="absolute top-8 left-8 z-20 pointer-events-none glass-panel p-4 rounded-sm border-l-2 border-l-pink-deep"
            >
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-2 h-2 bg-pink-deep rounded-full animate-pulse"></div>
                 <span className="text-xs font-bold uppercase tracking-widest text-pink-soft">System Status: Active</span>
               </div>
               <div className="text-[10px] opacity-60 text-pink-soft uppercase">
                  KERNEL: BDAY.PROTOCOL_V3.0<br/>
                  LOC: SECTOR_CELEBRATION<br/>
                  STATUS: DECRYPTING_JOY
               </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute top-8 right-8 z-20 pointer-events-none glass-panel p-4 rounded-sm text-right flex-col hidden sm:flex border-r-2 border-r-pink-deep"
            >
                <div className="text-xs uppercase tracking-tighter mb-1 opacity-80 text-pink-soft">Target Identification</div>
                <div className="text-lg md:text-xl font-bold neon-pink text-pink-deep">USER_HAPPINESS: 100%</div>
                <div className="text-[10px] opacity-60 mt-1 text-pink-soft">ENCRYPTION: NULL | AGE_INC: ++1</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-16 sm:bottom-8 w-full flex items-center justify-center gap-4 z-20 pointer-events-none"
            >
                <div className="w-16 sm:w-32 h-px bg-pink-deep/40"></div>
                <div className="text-[10px] tracking-widest opacity-60 text-pink-soft">INITIALIZING HOLOGRAPHIC_CORE</div>
                <div className="w-16 sm:w-32 h-px bg-pink-deep/40"></div>
            </motion.div>
            
            <div className="absolute bottom-8 left-8 z-20 pointer-events-auto glass-panel p-2 rounded-sm border-l-2 border-l-pink-deep hover:bg-pink-deep/20 transition-all cursor-pointer">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStage('console');
                  }}
                  className="text-pink-soft hover:text-white px-3 py-1 transition-all uppercase text-[10px] sm:text-xs tracking-widest font-mono flex items-center justify-center gap-2 w-full h-full cursor-pointer"
                >
                  <Terminal size={12} />
                  <span>[Revert]</span>
                </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}