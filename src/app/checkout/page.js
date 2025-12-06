'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import styles from './checkout.module.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/checkout');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading...</h1>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    instructions: '',
  });

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Please login to place an order');
      router.push('/login?redirect=/checkout');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            menuItem: item._id,
            name: item.name,
            price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
            quantity: item.quantity,
            selectedCustomizations: item.customizations,
          })),
          totalPrice: cartTotal,
          deliveryAddress: formData.address,
          phoneNumber: formData.phone,
          specialInstructions: formData.instructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/profile'); // Redirect to profile to see order
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      
      <div className={styles.grid}>
        <div className={styles.formSection}>
          <h2>Delivery Details</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Delivery Address</label>
              <textarea
                required
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your full delivery address"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Special Instructions (Optional)</label>
              <textarea
                rows="2"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Gate code, delivery preferences, etc."
              />
            </div>

            <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order - ₹${(cartTotal * 1.08).toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className={styles.summarySection}>
          <h2>Order Summary</h2>
          <div className={styles.itemsList}>
            {cart.map((item, idx) => (
              <div key={idx} className={styles.summaryItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name} x {item.quantity}</span>
                  {item.customizations && Object.keys(item.customizations).length > 0 && (
                    <span className={styles.itemCust}>
                      {Object.values(item.customizations).join(', ')}
                    </span>
                  )}
                </div>
                <span className={styles.itemPrice}>{item.price}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.totals}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Tax (8%)</span>
              <span>₹{(cartTotal * 0.08).toFixed(2)}</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>₹{(cartTotal * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
