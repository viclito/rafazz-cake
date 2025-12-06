'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchOrders();
      fetchMessages();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <h1 className={styles.title}>Hello, {session?.user?.name}</h1>
          <p className={styles.email}>{session?.user?.email}</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
          Sign Out
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Orders</h2>
          
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderId}>Order #{order._id.slice(-6)}</span>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={styles.itemRow}>
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.total}>
                      <span>Total</span>
                      <span>₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                    {order.adminAssignedTime && (
                      <div className={styles.deliveryTime}>
                        <span>Expected Delivery:</span>
                        <strong>{order.adminAssignedTime}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Messages</h2>
          
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No messages sent yet.</p>
            </div>
          ) : (
            <div className={styles.messagesList}>
              {messages.map((msg) => (
                <div key={msg._id} className={styles.messageCard}>
                  <div className={styles.messageHeader}>
                    <span className={styles.messageDate}>
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                    {msg.reply && <span className={styles.repliedBadge}>Replied</span>}
                  </div>
                  <p className={styles.messageText}>{msg.message}</p>
                  
                  {msg.reply && (
                    <div className={styles.replyBox}>
                      <div className={styles.replyHeader}>
                        <span className={styles.replyLabel}>Admin Reply:</span>
                        <span className={styles.replyDate}>
                          {new Date(msg.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={styles.replyContent}>{msg.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
