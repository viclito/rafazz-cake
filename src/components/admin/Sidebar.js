'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '◆' },
    { name: 'Orders', path: '/admin/dashboard/orders', icon: '📋' },
    { name: 'Messages', path: '/admin/dashboard/messages', icon: '✉️' },
    { name: 'Offers', path: '/admin/dashboard/offers', icon: '🏷️' },
    { name: 'Home Images', path: '/admin/dashboard/home-images', icon: '▣' },
    { name: 'Menu Items', path: '/admin/dashboard/menu-items', icon: '●' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.logo}>Rafazz Admin</h2>
        <p className={styles.user}>{session?.user?.name}</p>
        <Link href="/" className={styles.backToSite}>
          ← Back to Site
        </Link>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${
              pathname === item.path ? styles.active : ''
            }`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className={styles.logoutBtn}>
          <span className={styles.icon}>→</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
