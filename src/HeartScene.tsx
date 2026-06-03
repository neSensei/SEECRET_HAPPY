import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PresentationControls, Sparkles } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

/* ─── detect touch-only device once ─── */
const isTouchDevice =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

/* ════════════════════════════════════════
   UNIFIED HINT  (одинаковый для всех)
════════════════════════════════════════ */
const ClickHint = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
        transition={{ duration: 0.5 }}
        className="
          absolute left-1/2 -translate-x-1/2
          bottom-[18%] sm:bottom-[15%]
          z-30 pointer-events-none
          flex flex-col items-center gap-1.5
        "
      >
        {/* пульсирующее сердечко */}
        <motion.div
          animate={{ scale: [1, 1.28, 1] }}
          transition={{ repeat: Infinity, duration: 1.35, ease: 'easeInOut' }}
          className="
            text-pink-deep text-2xl sm:text-3xl leading-none
            drop-shadow-[0_0_8px_rgba(255,77,109,0.9)]
          "
        >
          ♡
        </motion.div>

        {/* подпись */}
        <div
          className="
            glass-panel px-3 py-1.5 sm:px-4 sm:py-2
            rounded-sm border border-pink-deep/50
            text-[9px] sm:text-[10px] font-mono tracking-widest uppercase
            text-pink-soft whitespace-nowrap
            shadow-[0_0_12px_rgba(255,77,109,0.25)]
          "
        >
          {isTouchDevice ? 'tap heart to read ✦' : 'click heart to read ✦'}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════
   INVISIBLE CLICK ZONE  (весь центр)
════════════════════════════════════════ */
const HeartClickZone = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label="Open birthday message"
    className="
      absolute z-20
      top-1/2 left-1/2
      -translate-x-1/2 -translate-y-[55%]
      w-48 h-48 sm:w-56 sm:h-56
      rounded-full bg-transparent cursor-pointer
    "
    style={{ WebkitTapHighlightColor: 'transparent' }}
  />
);

/* ════════════════════════════════════════
   RESPONSIVE CAMERA
════════════════════════════════════════ */
const ResponsiveCamera = () => {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const z = size.width < 480 ? 15 : size.width < 768 ? 12 : 10;
    camera.position.set(0, 0, z);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
};

/* ════════════════════════════════════════
   3-D HEART MESH
════════════════════════════════════════ */
const HeartModel = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 2, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 2,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 4,
      bevelSize: 1,
      bevelThickness: 1,
      curveSegments: 36,
    });
    geom.center();
    geom.rotateX(Math.PI);
    geom.scale(0.2, 0.2, 0.2);
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    /* медленнее крутится когда сообщение открыто */
    meshRef.current.rotation.y += delta * (isActive ? 0.06 : 0.2);
    const s =
      1 +
      Math.sin(state.clock.elapsedTime * (isActive ? 9 : 4)) *
        (isActive ? 0.09 : 0.05);
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#ff8fb1"
        emissive="#2a000a"
        transparent
        transmission={1}
        roughness={0.15}
        thickness={2.5}
        ior={1.5}
      />
    </mesh>
  );
};

/* ════════════════════════════════════════
   SCENE WRAPPER  (exported)
════════════════════════════════════════ */
export default function HeartScene({
  onHeartClick,
  msgOpen,
}: {
  onHeartClick: () => void;
  msgOpen: boolean;
}) {
  const [hintVisible, setHintVisible] = useState(true);

  const handleClick = useCallback(() => {
    setHintVisible(false);
    onHeartClick();
  }, [onHeartClick]);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        <ResponsiveCamera />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#ff4d6d" distance={30} />
        <pointLight position={[-10, -5, -10]} intensity={2.5} color="#4a00e0" distance={30} />
        <directionalLight position={[0, -5, 10]} intensity={0.3} color="#ffffff" />

        <PresentationControls
          global
          snap
          speed={1.5}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <Float speed={2} rotationIntensity={0.25} floatIntensity={0.5}>
            <HeartModel isActive={msgOpen} />
          </Float>
        </PresentationControls>

        <Sparkles
          count={isTouchDevice ? 120 : 300}
          scale={isTouchDevice ? 7 : 10}
          size={isTouchDevice ? 1.5 : 2}
          speed={0.5}
          opacity={0.6}
          color="#ff4d6d"
        />
      </Canvas>

      {/* подсказка + зона клика */}
      <ClickHint visible={hintVisible && !msgOpen} />
      <HeartClickZone onClick={handleClick} />
    </div>
  );
}