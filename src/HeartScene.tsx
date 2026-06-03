import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const HeartModel = ({ onHoverChange }: { onHoverChange?: (hovered: boolean) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;
    
    // Standard symmetric heart equation
    shape.moveTo( x + 5, y + 5 );
    shape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    shape.bezierCurveTo( x - 6, y, x - 6, y + 7, x - 6, y + 7 );
    shape.bezierCurveTo( x - 6, y + 11, x - 2, y + 15.4, x + 5, y + 19 );
    shape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    shape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    shape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    const extrudeSettings = {
      depth: 2,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 4,
      bevelSize: 1,
      bevelThickness: 1,
      curveSegments: 36, // increased for smoother glass reflections
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    geom.rotateX(Math.PI);
    geom.scale(0.2, 0.2, 0.2);
    
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly transition rotation speed
      const targetSpeed = hovered ? 0.05 : 0.2;
      meshRef.current.rotation.y += delta * targetSpeed;
      
      // Pulsing effect
      const pulseSpeed = hovered ? 8 : 4;
      const pulseAmount = hovered ? 0.08 : 0.05;
      const scale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseAmount;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        onHoverChange?.(true);
      }}
      onPointerOut={(e) => {
        setHovered(false);
        document.body.style.cursor = 'auto';
        onHoverChange?.(false);
      }}
    >
      <meshPhysicalMaterial 
        color="#ff8fb1"
        emissive="#2a000a"
        transparent={true}
        transmission={1}
        roughness={0.15}
        thickness={2.5}
        ior={1.5}
      />
    </mesh>
  );
};

export default function HeartScene({ onHoverChange }: { onHoverChange?: (hovered: boolean) => void }) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.2} />
        
        {/* Pink/Red contrast light */}
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#ff4d6d" distance={30} />
        
        {/* Blue/Emerald contrast light */}
        <pointLight position={[-10, -5, -10]} intensity={2.5} color="#4a00e0" distance={30} />
        
        {/* Fill light */}
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
            <HeartModel onHoverChange={onHoverChange} />
          </Float>
        </PresentationControls>

        <Sparkles count={300} scale={10} size={2} speed={0.5} opacity={0.6} color="#ff4d6d" />
      </Canvas>
    </div>
  );
}
