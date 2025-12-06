'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './home-images.module.css';

export default function HomeImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    label: '',
    imageData: '',
    linkTo: '/menu',
    linkText: 'Learn more',
    position: 0,
    cardType: 'regular',
    gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/home-images');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageData: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = '/api/home-images';
      const method = editingImage ? 'PUT' : 'POST';
      const body = editingImage
        ? { id: editingImage._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save image');

      toast.success(editingImage ? 'Image updated!' : 'Image created!');
      setShowModal(false);
      resetForm();
      fetchImages();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/home-images?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete image');

      toast.success('Image deleted!');
      fetchImages();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      label: image.label,
      imageData: image.imageData,
      linkTo: image.linkTo,
      linkText: image.linkText,
      position: image.position,
      cardType: image.cardType,
      gradient: image.gradient,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingImage(null);
    setFormData({
      title: '',
      label: '',
      imageData: '',
      linkTo: '/menu',
      linkText: 'Learn more',
      position: 0,
      cardType: 'regular',
      gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Home Page Images</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className={styles.addButton}
        >
          + Add Image
        </button>
      </div>

      <div className={styles.grid}>
        {images.map((image) => (
          <div key={image._id} className={styles.imageCard}>
            <div className={styles.imagePreview}>
              {image.imageData ? (
                <img src={image.imageData} alt={image.title} />
              ) : (
                <div
                  className={styles.gradientPreview}
                  style={{ background: image.gradient }}
                />
              )}
              
              {/* Card type badge overlaid on image */}
              <div className={styles.cardTypeBadge}>
                {image.cardType}
              </div>
              
              {/* Action buttons overlaid on image */}
              <div className={styles.imageActions}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(image);
                  }} 
                  className={`${styles.iconBtn} ${styles.editIconBtn}`}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(image._id);
                  }} 
                  className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className={styles.imageInfo}>
              <h3>{image.title}</h3>
              <span className={styles.badge}>{image.label}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingImage ? 'Edit Image' : 'Add New Image'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Label</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Card Type</label>
                <select
                  value={formData.cardType}
                  onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                >
                  <option value="regular">Regular</option>
                  <option value="large">Large</option>
                  <option value="tall">Tall</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Position (Order)</label>
                <input
                  type="number"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Image Upload</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formData.imageData && (
                  <img src={formData.imageData} alt="Preview" className={styles.preview} />
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Link To</label>
                <input
                  type="text"
                  value={formData.linkTo}
                  onChange={(e) => setFormData({ ...formData, linkTo: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Link Text</label>
                <input
                  type="text"
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingImage ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
