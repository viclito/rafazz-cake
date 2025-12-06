'use client';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, Stars, Sparkles, Center } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './CakeHero.module.css';

function CustomCake() {
  const materials = useLoader(MTLLoader, '/cake3d/13500_Wedding_Cake_v1_L1.mtl');
  const obj = useLoader(OBJLoader, '/cake3d/13500_Wedding_Cake_v1_L1.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.15;
  });

  // Upgrade materials for better lighting response
  if (obj) {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // If the material is basic/phong, upgrade it to Standard for PBR lighting
        if (child.material) {
          child.material.roughness = 0.5;
          child.material.metalness = 0.1;
          child.material.needsUpdate = true;
        }
      }
    });
  }

  return (
    <group ref={group} dispose={null}>
      <Center>
        <primitive object={obj} scale={0.28} rotation={[-Math.PI / 2, 0, 0]} />
      </Center>
    </group>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gold" wireframe />
    </mesh>
  );
}

export default function CakeHero() {
  const { theme } = useTheme();
  const starsColor = theme === 'dark' ? '#333131ff' : '#1d1d1f';
  
  return (
    <div className={styles.container}>
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }} shadows>
        <ambientLight intensity={1.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={3} 
          color="#fff" 
          castShadow 
          shadow-bias={-0.0001}
        />
        <pointLight position={[-10, -5, -10]} intensity={2} color="#D4AF37" />
        <directionalLight position={[5, 5, 5]} intensity={2} castShadow />
        
        <Environment preset="studio" />
        <Stars 
          key={`stars-${theme}`}
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
          color={starsColor}
        />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Suspense fallback={<Loader />}>
            <CustomCake />
          </Suspense>
        </Float>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={2} far={4} color="#000" />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
