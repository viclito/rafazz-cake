'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './OffersSection.module.css';

export default function OffersSection() {
  const [offer, setOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffer();
  }, []);

  useEffect(() => {
    if (!offer) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(offer.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setOffer(null); // Hide offer if expired
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [offer]);

  const fetchOffer = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      if (data.offer && data.offer.isActive) {
        // Check if expired
        if (new Date(data.offer.endTime) > new Date()) {
          setOffer(data.offer);
        }
      }
    } catch (error) {
      console.error('Failed to fetch offer');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !offer) return null;

  return (
    <section className={styles.container}>
      <motion.div 
        className={styles.offerCard}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {offer.backgroundImage && (
          <div className={styles.backgroundMedia}>
            {offer.backgroundImage.match(/\.(mp4|webm)$/i) ? (
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className={styles.media}
              >
                <source src={offer.backgroundImage} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={offer.backgroundImage} 
                alt="Offer Background" 
                className={styles.media} 
              />
            )}
            <div className={styles.overlay} />
          </div>
        )}
        <div className={styles.content}>
          <motion.span 
            className={styles.tag}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Limited Time Offer
          </motion.span>
          
          <motion.h2 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {offer.title}
          </motion.h2>
          
          <motion.p 
            className={styles.description}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {offer.description}
          </motion.p>

          <div className={styles.timer}>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.days).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Days</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Hours</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Mins</span>
            </div>
            <span className={styles.separator}>:</span>
            <div className={styles.timeBlock}>
              <span className={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className={styles.timeLabel}>Secs</span>
            </div>
          </div>

          <Link href="/menu">
            <motion.button 
              className={styles.shopBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Now
            </motion.button>
          </Link>
        </div>

        {offer.discountPercentage && (
          <motion.div 
            className={styles.badge}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
          >
            <span className={styles.discountValue}>{offer.discountPercentage}%</span>
            <span className={styles.discountLabel}>OFF</span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
