'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    homeImages: 0,
    menuItems: 0,
    orders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [imagesRes, itemsRes, ordersRes] = await Promise.all([
        fetch('/api/home-images'),
        fetch('/api/menu-items'),
        fetch('/api/admin/orders'),
      ]);
      
      const imagesData = await imagesRes.json();
      const itemsData = await itemsRes.json();
      const ordersData = await ordersRes.json();
      
      setStats({
        homeImages: imagesData.images?.length || 0,
        menuItems: itemsData.items?.length || 0,
        orders: ordersData.orders?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const cards = [
    {
      title: 'Orders',
      description: 'Manage customer orders',
      icon: '📋',
      link: '/admin/dashboard/orders',
      color: '#FF9500',
      count: stats.orders,
    },
    {
      title: 'Home Images',
      description: 'Manage homepage bento grid',
      icon: '▣',
      link: '/admin/dashboard/home-images',
      color: '#007AFF',
      count: stats.homeImages,
    },
    {
      title: 'Menu Items',
      description: 'Add and edit menu products',
      icon: '●',
      link: '/admin/dashboard/menu-items',
      color: '#34C759',
      count: stats.menuItems,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back, {session?.user?.name}!</h1>
        <p className={styles.subtitle}>Manage your Rafazz store content</p>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            className={styles.card}
            style={{ '--card-color': card.color }}
          >
            <div className={styles.cardIcon}>{card.icon}</div>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.cardDescription}>{card.description}</p>
            <div className={styles.cardCount}>{card.count} items</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
