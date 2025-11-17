/* eslint-disable react/no-unknown-property */
import React, { forwardRef, useMemo, useRef, useLayoutEffect } from 'react';
// --- CORRECCIÓN 1: Importar 'type' para RootState ---
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
// --- CORRECCIÓN 2: Importar 'type' para IUniform y combinar imports ---
import { Color, Mesh, ShaderMaterial, type IUniform } from 'three';

type NormalizedRGB = [number, number, number];

const hexToNormalizedRGB = (hex: string): NormalizedRGB => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b];
};

interface UniformValue<T = number | Color> {
  value: T;
}

interface SilkUniforms {
  uSpeed: UniformValue<number>;
  uScale: UniformValue<number>;
  uNoiseIntensity: UniformValue<number>;
  uColor: UniformValue<Color>;
  uRotation: UniformValue<number>;
  uTime: UniformValue<number>;
  [uniform: string]: IUniform;
}

// (Tu vertexShader va aquí)
const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// (Tu fragmentShader va aquí)
const fragmentShader = `
varying vec2 vUv;
uniform float uSpeed;
uniform float uScale;
uniform float uNoiseIntensity;
uniform vec3 uColor;
uniform float uRotation;
uniform float uTime;
// ... (tu lógica de shader) ...
void main() {
  gl_FragColor = vec4(uColor, 1.0);
}
`;

// --- CORRECCIÓN 3: SilkPlane AHORA ACEPTA LAS PROPS ---
// (Esto arregla el error "'props' is declared but its value is never read")
const SilkPlane = forwardRef<Mesh, SilkProps>(({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0
}, ref) => {
  const { viewport } = useThree();

  // --- CORRECCIÓN 4: Los uniforms AHORA USAN LAS PROPS ---
  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  useLayoutEffect(() => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    if (mesh.current) {
      mesh.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useFrame((_state: RootState, delta: number) => {
    const mesh = ref as React.MutableRefObject<Mesh | null>;
    if (mesh.current) {
      const material = mesh.current.material as ShaderMaterial & {
        uniforms: SilkUniforms;
      };
      material.uniforms.uTime.value += 0.1 * delta;
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

export interface SilkProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
}

// --- CORRECCIÓN 5: El componente padre ahora pasa las props ---
const Silk: React.FC<SilkProps> = (props) => {
  const meshRef = useRef<Mesh>(null);

  // --- (El 'useMemo' de uniforms se quitó de aquí, arreglando el error) ---

  return (
    <Canvas>
      {/* Pasa todas las props (speed, color, etc.) a SilkPlane */}
      <SilkPlane ref={meshRef} {...props} />
    </Canvas>
  );
};

export default Silk;