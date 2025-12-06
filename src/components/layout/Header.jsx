'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      className={styles.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Link href="/" className={styles.logo}>
        <div style={{ position: 'relative', width: '120px', height: '40px' }}>
          <img 
            src="/logo.jpeg" 
            alt="Rafazz Pastry" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
      </Link>

      {/* Desktop Nav */}
      <nav className={styles.nav}>
        {['Home', 'Menu', 'About', 'Contact'].map((item) => (
          <Link key={item} href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className={styles.navLink}>
            {item}
          </Link>
        ))}
        {session?.user?.role === 'admin' && (
          <Link href="/admin/dashboard" className={styles.dashboardLink}>
            Dashboard
          </Link>
        )}
      </nav>

      <div className={styles.actions}>
        <ThemeToggle />
        
        {session?.user?.role !== 'admin' && (
          <Link href="/cart" className={styles.cartBtn}>
            <span className={styles.cartIcon}>🛒</span>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>
        )}

        {/* Desktop Auth */}
        <div className={styles.desktopAuth}>
          {session ? (
            <div className={styles.userMenu}>
              {session.user.role === 'admin' ? (
                <Link href="/admin/dashboard" className={styles.dashboardLink}>
                  Dashboard
                </Link>
              ) : (
                <Link href="/profile" className={styles.profileLink}>
                  Profile
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                Sign In
              </Link>
              <Link href="/register" className={styles.signupBtn}>
                Sign Up
              </Link>
            </div>
          )}
          
          <Link href="/menu" className={styles.cta}>
            Order Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {['Home', 'Menu', 'About', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            
            <div className={styles.mobileAuth}>
              {session ? (
                <>
                  {session.user.role === 'admin' ? (
                    <Link href="/admin/dashboard" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/profile" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/register" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
              <Link href="/menu" className={`${styles.cta} ${styles.mobileCta}`} onClick={() => setIsMenuOpen(false)}>
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
