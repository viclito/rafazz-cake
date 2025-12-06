'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './cart.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Cart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/cart');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <span className={styles.emptyIcon}>🛒</span>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added any delicious treats yet.</p>
          <Link href="/menu" className={styles.shopBtn}>
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>
      
      <div className={styles.grid}>
        <div className={styles.items}>
          {cart.map((item, index) => (
            <div key={`${item._id}-${index}`} className={styles.item}>
              <div className={styles.itemImage}>
                {item.imageData ? (
                  <Image 
                    src={item.imageData} 
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.placeholder}>🍰</div>
                )}
              </div>
              
              <div className={styles.itemDetails}>
                <div className={styles.itemHeader}>
                  <h3>{item.name}</h3>
                  <span className={styles.price}>{item.price}</span>
                </div>
                
                {item.customizations && Object.keys(item.customizations).length > 0 && (
                  <div className={styles.customizations}>
                    {Object.entries(item.customizations).map(([key, value]) => (
                      <p key={key}>
                        <span className={styles.custLabel}>{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                )}

                <div className={styles.itemActions}>
                  <div className={styles.quantity}>
                    <button 
                      onClick={() => updateQuantity(item._id, item.customizations, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.customizations, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item._id, item.customizations)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className={styles.clearBtn}>
            Clear Cart
          </button>
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (8%)</span>
            <span>₹{(cartTotal * 0.08).toFixed(2)}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>₹{(cartTotal * 1.08).toFixed(2)}</span>
          </div>
          
          <Link href="/checkout" className={styles.checkoutBtn}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
