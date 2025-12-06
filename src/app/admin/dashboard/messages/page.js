'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './messages.module.css';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [sending, setSending] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, text) => {
    setReplyText(prev => ({ ...prev, [id]: text }));
  };

  const handleSendReply = async (id) => {
    if (!replyText[id]) return;
    
    setSending(prev => ({ ...prev, [id]: true }));
    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reply: replyText[id] }),
      });

      if (!response.ok) throw new Error('Failed to send reply');

      toast.success('Reply sent successfully');
      fetchMessages(); // Refresh to show updated state
      setReplyText(prev => ({ ...prev, [id]: '' }));
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSending(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
      </div>

      <div className={styles.grid}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>No messages found.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.senderName}>{msg.name}</span>
                  <span className={styles.senderEmail}>{msg.email}</span>
                </div>
                <span className={styles.date}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.message}>{msg.message}</p>
                
                {msg.reply ? (
                  <div className={styles.replySection}>
                    <div className={styles.replyHeader}>
                      <span className={styles.replyLabel}>Replied on {new Date(msg.repliedAt).toLocaleDateString()}:</span>
                    </div>
                    <p className={styles.replyText}>{msg.reply}</p>
                  </div>
                ) : (
                  <div className={styles.replyForm}>
                    <textarea
                      placeholder="Type your reply..."
                      value={replyText[msg._id] || ''}
                      onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                      className={styles.replyInput}
                    />
                    <button 
                      onClick={() => handleSendReply(msg._id)}
                      disabled={sending[msg._id] || !replyText[msg._id]}
                      className={styles.replyBtn}
                    >
                      {sending[msg._id] ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
