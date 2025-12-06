import styles from './page.module.css';
import Image from 'next/image';

export default function About() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Our Story</h1>
        <div className={styles.content}>
          <p>
            Rafazz began with a simple dream: to create cakes that are not just desserts, but memories. Founded in 2023 by Blessy Neha Prince P, our bakery has grown from a small home kitchen to a beloved local institution.
          </p>
          <div className={styles.imageSection} style={{ position: 'relative', height: '400px', width: '100%', margin: '2rem 0' }}>
            <Image 
              src="/images/about-image.jpg" 
              alt="Rafazz Bakery Interior" 
              fill
              style={{ objectFit: 'cover', borderRadius: '24px' }}
            />
          </div>
          <p>
            We use only the finest ingredients—Belgian chocolate, Madagascar vanilla, and locally sourced fruits. Every cake is a labor of love, handcrafted to perfection. We believe in the power of sweetness to bring people together.
          </p>
        </div>

        <h2 className={styles.title} style={{ marginTop: '5rem', fontSize: '2.5rem' }}>Meet Our 7-Member Team</h2>
        <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem', color: 'var(--text-secondary)' }}>
          Our dedicated team of 7 passionate individuals works tirelessly to bring you the best baking experience.
        </p>
        <div className={styles.teamGrid}>
          {[
            'Blessy.S',
            'Anamika.N.V',
            'Blessy Neha Prince. P',
            'Fathima Sana.M',
            'Akalya Devi.S',
            'Sebeya.S',
            'Abinaya.M'
          ].map((name, index) => (
            <div key={index} className={styles.teamMember}>
              <h3 className={styles.memberName} style={{ margin: '0', fontSize: '1.2rem' }}>{name}</h3>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
