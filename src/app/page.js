import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import connectDB from '@/lib/mongodb';
import HomeImage from '@/models/HomeImage';
import CakeHeroWrapper from '@/components/home/CakeHeroWrapper';
import OffersSection from '@/components/home/OffersSection';

async function getHomeImages() {
  try {
    await connectDB();
    const images = await HomeImage.find({ isActive: true }).sort({ position: 1 }).lean();
    
    // Convert _id and other non-serializable fields to strings
    return images.map(img => ({
      ...img,
      _id: img._id.toString(),
      createdAt: img.createdAt?.toString(),
      updatedAt: img.updatedAt?.toString(),
    }));
  } catch (error) {
    console.error('Error fetching home images:', error);
    return [];
  }
}

export default async function Home() {
  const images = await getHomeImages();

  return (
    <main className={styles.main}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          {/* <h1 className={styles.heroTitle}>Rafazz Pro</h1> */}
          {/* <p className={styles.heroSubtitle}>Titanium. So strong. So light. So sweet.</p> */}
        </div>
        <CakeHeroWrapper />
      </div>

      <OffersSection />
      
      <section className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>The Collection.</h2>
        <div className={styles.bentoGrid}>
          {images.length > 0 ? (
            images.map((image) => (
              <div 
                key={image._id} 
                className={`${styles.bentoCard} ${
                  image.cardType === 'large' ? styles.largeCard : 
                  image.cardType === 'tall' ? styles.tallCard : ''
                }`}
              >
                {image.imageData ? (
                  <Image 
                    src={image.imageData} 
                    alt={image.title}
                    fill
                    className={styles.cardImage}
                    style={{objectFit: 'cover'}}
                  />
                ) : (
                  <div 
                    className={styles.cardImagePlaceholder} 
                    style={{background: image.gradient}}
                  />
                )}
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>{image.label}</span>
                  <h3 className={styles.cardTitle}>{image.title}</h3>
                  <Link href={image.linkTo} className={styles.cardLink}>
                    {image.linkText} &gt;
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // Fallback content if no images in database
            <>
              <div className={`${styles.bentoCard} ${styles.largeCard}`}>
                <Image 
                  src="/images/midnight-chocolate.png" 
                  alt="Midnight Chocolate Cake"
                  fill
                  className={styles.cardImage}
                  style={{objectFit: 'cover'}}
                />
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>New Arrival</span>
                  <h3 className={styles.cardTitle}>Midnight Chocolate.</h3>
                  <Link href="/menu" className={styles.cardLink}>Learn more &gt;</Link>
                </div>
              </div>

              <div className={styles.bentoCard}>
                <div className={styles.cardImagePlaceholder} style={{background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'}}></div>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>Classic</span>
                  <h3 className={styles.cardTitle}>Vanilla Air.</h3>
                  <Link href="/menu" className={styles.cardLink}>Buy &gt;</Link>
                </div>
              </div>

              <div className={`${styles.bentoCard} ${styles.tallCard}`}>
                <div className={styles.cardImagePlaceholder} style={{background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'}}></div>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>Story</span>
                  <h3 className={styles.cardTitle}>Designed to be eaten.</h3>
                  <p style={{color: '#888', marginTop: '10px'}}>Discover the craftsmanship behind every layer.</p>
                  <Link href="/about" className={styles.cardLink} style={{marginTop: '1rem'}}>Watch the film &gt;</Link>
                </div>
              </div>

              <div className={styles.bentoCard}>
                <div className={styles.cardImagePlaceholder} style={{background: 'linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%)'}}></div>
                <div className={styles.cardContent}>
                  <span className={styles.cardLabel}>Limited</span>
                  <h3 className={styles.cardTitle}>Gold Edition.</h3>
                  <Link href="/menu" className={styles.cardLink}>Order now &gt;</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
