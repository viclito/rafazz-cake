'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('user-login', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success('Login successful!');
      
      // Check for redirect param
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || '/';
      
      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your Rafazz account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <Link href="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
