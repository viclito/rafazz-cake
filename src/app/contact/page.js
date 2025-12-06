'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.infoSection}>
          <h1 className={styles.title}>Get in Touch</h1>
          <p>
            Have a question or want to place a custom order? We'd love to hear from you. Fill out the form or visit us at our bakery.
          </p>
          
          <h2>Visit Us</h2>
          <p>
            7/4, Single Street, Krishnancoil<br />
            Nagercoil, Kanyakumari - 629001
          </p>

          <h2>Opening Hours</h2>
          <p>
            Mon - Fri: 8am - 8pm<br />
            Sat - Sun: 9am - 6pm
          </p>

          <h2>Contact Info</h2>
          <p>
            Owner: Blessy Neha Prince P<br />
            Phone: +91 98765 43210<br />
            Email: hello@rafazz.com
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input 
              type="text" 
              id="name" 
              className={styles.input} 
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input 
              type="email" 
              id="email" 
              className={styles.input} 
              placeholder="your@email.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea 
              id="message" 
              className={styles.textarea} 
              placeholder="Tell us about your dream cake..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  );
}
