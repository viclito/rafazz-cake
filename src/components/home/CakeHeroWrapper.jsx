'use client';

import dynamic from 'next/dynamic';
import styles from '@/app/page.module.css';
import CakeHero from '../canvas/CakeHero';

// const CakeHero = dynamic(() => import('@/components/canvas/CakeHero'), { 
//   ssr: false,
//   loading: () => <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}></div>
// });

export default function CakeHeroWrapper() {
  return <CakeHero />;
}
