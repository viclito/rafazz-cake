'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from 'react-hot-toast';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
