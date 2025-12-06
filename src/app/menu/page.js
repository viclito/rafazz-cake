'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

const categories = ['All', 'Cakes', 'Cupcakes', 'Pastries'];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = activeCategory === 'All' 
        ? '/api/menu-items' 
        : `/api/menu-items?category=${activeCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.items || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    // Initialize customizations based on product options
    const initialCustomizations = {};
    if (product.customizationOptions) {
      product.customizationOptions.forEach(opt => {
        initialCustomizations[opt.name] = opt.type === 'select' ? opt.options[0] : '';
      });
    }
    setCustomizations(initialCustomizations);
  };

  const handleCustomizationChange = (name, value) => {
    setCustomizations(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // Validate required fields
    if (selectedProduct.customizationOptions) {
      for (const opt of selectedProduct.customizationOptions) {
        if (opt.required && !customizations[opt.name]) {
          toast.error(`Please select ${opt.name}`);
          return;
        }
      }
    }

    addToCart(selectedProduct, 1, customizations);
    setSelectedProduct(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Menu</h1>
        <p className={styles.subtitle}>Explore our wide range of handcrafted delights, baked fresh daily.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <motion.div layout className={styles.grid}>
            {products.map(product => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product._id} 
                className={styles.card}
                onClick={() => handleProductClick(product)}
              >
                <div className={styles.cardImage}>
                  {product.imageData ? (
                    <Image 
                      src={product.imageData} 
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      <span style={{ fontSize: '48px' }}>🍰</span>
                    </div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{product.name}</h3>
                  {product.description && (
                    <p className={styles.cardDescription}>{product.description}</p>
                  )}
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{product.price.replace('$', '₹')}</span>
                    <button className={styles.addBtn}>Add to Cart</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedProduct(null)}>×</button>
              
              <div className={styles.modalImage}>
                {selectedProduct.imageData ? (
                  <Image 
                    src={selectedProduct.imageData} 
                    alt={selectedProduct.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <span style={{ fontSize: '64px' }}>🍰</span>
                  </div>
                )}
              </div>

              <div className={styles.modalContent}>
                <h2>{selectedProduct.name}</h2>
                <p className={styles.modalPrice}>{selectedProduct.price.replace('$', '₹')}</p>
                <p className={styles.modalDesc}>{selectedProduct.description}</p>

                {selectedProduct.customizationOptions?.length > 0 && (
                  <div className={styles.customizations}>
                    <h3>Customize your order</h3>
                    {selectedProduct.customizationOptions.map((opt, idx) => (
                      <div key={idx} className={styles.customizationGroup}>
                        <label>
                          {opt.name} {opt.required && <span className={styles.required}>*</span>}
                        </label>
                        {opt.type === 'select' ? (
                          <select 
                            value={customizations[opt.name] || ''}
                            onChange={(e) => handleCustomizationChange(opt.name, e.target.value)}
                          >
                            {opt.options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            type="text"
                            value={customizations[opt.name] || ''}
                            onChange={(e) => handleCustomizationChange(opt.name, e.target.value)}
                            placeholder={`Enter ${opt.name}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                  Add to Cart - {selectedProduct.price.replace('$', '₹')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
