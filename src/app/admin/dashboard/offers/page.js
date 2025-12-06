'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './offers.module.css';

export default function OffersPage() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    endTime: '',
    isActive: true,
    backgroundImage: '',
  });
  const [offerId, setOfferId] = useState(null);

  useEffect(() => {
    fetchActiveOffer();
  }, []);

  const fetchActiveOffer = async () => {
    try {
      const response = await fetch('/api/offers');
      const data = await response.json();
      if (data.offer) {
        setOfferId(data.offer._id);
        setFormData({
          title: data.offer.title,
          description: data.offer.description,
          discountPercentage: data.offer.discountPercentage,
          endTime: new Date(data.offer.endTime).toISOString().slice(0, 16), // Format for datetime-local
          isActive: data.offer.isActive,
          backgroundImage: data.offer.backgroundImage || '',
        });
      }
    } catch (error) {
      toast.error('Failed to fetch offer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (offerId) payload._id = offerId;

      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save offer');

      const data = await response.json();
      setOfferId(data.offer._id);
      toast.success('Offer saved successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Offers</h1>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Offer Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Flash Sale!"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              required
              rows="3"
              placeholder="e.g. Get 20% off on all chocolate cakes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Discount (%)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Time</label>
              <input
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Background Image URL (Image or Video)</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg or .mp4"
              value={formData.backgroundImage}
              onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>

          <button type="submit" className={styles.saveBtn}>
            Save Offer
          </button>
        </form>

        <div className={styles.preview}>
          <h3>Preview</h3>
          <div className={styles.previewCard}>
            <div className={styles.previewContent}>
              <span className={styles.previewTag}>Limited Time Offer</span>
              <h2>{formData.title || 'Offer Title'}</h2>
              <p>{formData.description || 'Offer description goes here...'}</p>
              <div className={styles.previewTimer}>
                <span>02</span>:<span>14</span>:<span>35</span>:<span>12</span>
              </div>
              <button className={styles.previewBtn}>Shop Now</button>
            </div>
            {formData.discountPercentage && (
              <div className={styles.previewBadge}>
                {formData.discountPercentage}% OFF
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
