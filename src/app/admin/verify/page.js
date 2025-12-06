'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => {
            router.push('/admin/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Email Verification</h1>
        </div>

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {status === 'verifying' && (
            <div>
              <div className="spinner"></div>
              <p style={{ color: '#86868b', marginTop: '16px' }}>{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <p style={{ color: '#34c759', fontSize: '18px', fontWeight: '500' }}>
                {message}
              </p>
              <p style={{ color: '#86868b', marginTop: '8px' }}>
                Redirecting to login...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✕</div>
              <p style={{ color: '#ff3b30', fontSize: '18px', fontWeight: '500' }}>
                {message}
              </p>
              <Link href="/admin/login" className={styles.link} style={{ display: 'inline-block', marginTop: '16px' }}>
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #000;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
