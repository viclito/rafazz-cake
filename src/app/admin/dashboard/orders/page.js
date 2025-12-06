'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './orders.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    adminAssignedTime: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      adminAssignedTime: order.adminAssignedTime || '',
    });
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder._id,
          ...updateData,
        }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      toast.success('Order updated successfully');
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders Management</h1>
      </div>

      <div className={styles.grid}>
        {orders.map((order) => (
          <div key={order._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.orderId}>#{order._id.slice(-6)}</span>
                <span className={styles.customerName}>{order.user?.name}</span>
              </div>
              <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                {order.status}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <span>Total:</span>
                <strong>₹{order.totalPrice.toFixed(2)}</strong>
              </div>
              <div className={styles.infoRow}>
                <span>Date:</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              {order.adminAssignedTime && (
                <div className={styles.infoRow}>
                  <span>Delivery:</span>
                  <span className={styles.deliveryTime}>{order.adminAssignedTime}</span>
                </div>
              )}
            </div>

            <div className={styles.itemsPreview}>
              {order.items.slice(0, 2).map((item, idx) => (
                <div key={idx} className={styles.itemRow}>
                  {item.quantity}x {item.name}
                </div>
              ))}
              {order.items.length > 2 && (
                <div className={styles.moreItems}>+{order.items.length - 2} more items</div>
              )}
            </div>

            <button 
              className={styles.viewBtn}
              onClick={() => handleUpdateClick(order)}
            >
              View & Update
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            
            <h2>Order Details</h2>
            
            <div className={styles.modalSection}>
              <h3>Customer Info</h3>
              <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
              <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
              <p><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
              <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
              {selectedOrder.specialInstructions && (
                <p><strong>Note:</strong> {selectedOrder.specialInstructions}</p>
              )}
            </div>

            <div className={styles.modalSection}>
              <h3>Order Items</h3>
              <div className={styles.itemsList}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className={styles.itemDetail}>
                    <div className={styles.itemMain}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>x{item.quantity}</span>
                      <span className={styles.itemPrice}>₹{item.price}</span>
                    </div>
                    {item.selectedCustomizations && (
                      <div className={styles.itemCust}>
                        {Object.entries(item.selectedCustomizations).map(([key, val]) => (
                          <span key={key}>{key}: {val}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.totalRow}>
                <strong>Total:</strong>
                <strong>₹{selectedOrder.totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <form onSubmit={handleUpdateSubmit} className={styles.updateForm}>
              <h3>Update Status</h3>
              
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Assigned Delivery Time</label>
                <input
                  type="text"
                  placeholder="e.g. Today at 5:00 PM"
                  value={updateData.adminAssignedTime}
                  onChange={(e) => setUpdateData({ ...updateData, adminAssignedTime: e.target.value })}
                />
              </div>

              <button type="submit" className={styles.updateBtn}>
                Update Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
