import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div style={{ position: 'relative', width: '150px', height: '50px', marginBottom: '1rem' }}>
            <img 
              src="/logo.jpeg" 
              alt="Rafazz Pastry" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <p>Crafting sweet memories, one cake at a time. Experience the art of baking with our premium selection.</p>
        </div>
        <div className={styles.column}>
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </div>
        <div className={styles.column}>
          <h3>Contact Us</h3>
          <p>7/4, Single Street, Krishnancoil</p>
          <p>Nagercoil, Kanyakumari - 629001</p>
          <p>hello@rafazz.com</p>
          <p>+91 98765 43210</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Rafazz. All rights reserved.</p>
        <p>
          Designed and developed by{' '}
          <a 
            href="https://portfolio-git-main-berglins-projects.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.developerLink}
          >
            Berglin
          </a>
        </p>
      </div>
    </footer>
  );
}
