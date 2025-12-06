'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from '../home-images/home-images.module.css';

export default function MenuItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cakes',
    price: '',
    description: '',
    imageData: '',
    customizationOptions: [],
  });

  // New state for adding a customization option
  const [newOption, setNewOption] = useState({
    name: '',
    type: 'select',
    optionsString: '', // Comma separated for input
    required: false,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/menu-items');
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      toast.error('Failed to fetch menu items');
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

  const handleAddOption = () => {
    if (!newOption.name) {
      toast.error('Option name is required');
      return;
    }

    const options = newOption.type === 'select' 
      ? newOption.optionsString.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (newOption.type === 'select' && options.length === 0) {
      toast.error('Please provide options for select type');
      return;
    }

    setFormData({
      ...formData,
      customizationOptions: [
        ...formData.customizationOptions,
        {
          name: newOption.name,
          type: newOption.type,
          options,
          required: newOption.required,
        }
      ]
    });

    setNewOption({
      name: '',
      type: 'select',
      optionsString: '',
      required: false,
    });
  };

  const removeOption = (index) => {
    const newOptions = [...formData.customizationOptions];
    newOptions.splice(index, 1);
    setFormData({ ...formData, customizationOptions: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = '/api/menu-items';
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem
        ? { id: editingItem._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save item');

      toast.success(editingItem ? 'Item updated!' : 'Item created!');
      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/menu-items?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      toast.success('Item deleted!');
      fetchItems();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      imageData: item.imageData || '',
      customizationOptions: item.customizationOptions || [],
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Cakes',
      price: '',
      description: '',
      imageData: '',
      customizationOptions: [],
    });
    setNewOption({
      name: '',
      type: 'select',
      optionsString: '',
      required: false,
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Menu Items</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className={styles.addButton}
        >
          + Add Item
        </button>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item._id} className={styles.imageCard}>
            <div className={styles.imagePreview}>
              {item.imageData ? (
                <img src={item.imageData} alt={item.name} />
              ) : (
                <div className={styles.gradientPreview} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                  🍰
                </div>
              )}
              
              <div className={styles.cardTypeBadge}>
                {item.category}
              </div>
              
              <div className={styles.imageActions}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }} 
                  className={`${styles.iconBtn} ${styles.editIconBtn}`}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }} 
                  className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className={styles.imageInfo}>
              <h3>{item.name}</h3>
              <span className={styles.badge}>{item.price}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Cakes">Cakes</option>
                  <option value="Cupcakes">Cupcakes</option>
                  <option value="Pastries">Pastries</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Price</label>
                <input
                  type="text"
                  required
                  placeholder="₹45"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Customization Options</label>
                <div style={{ background: '#f5f5f7', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      placeholder="Option Name (e.g. Size)"
                      value={newOption.name}
                      onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d2d2d7' }}
                    />
                    <select
                      value={newOption.type}
                      onChange={(e) => setNewOption({ ...newOption, type: e.target.value })}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d2d2d7' }}
                    >
                      <option value="select">Dropdown Selection</option>
                      <option value="text">Text Input</option>
                    </select>
                  </div>
                  
                  {newOption.type === 'select' && (
                    <input
                      type="text"
                      placeholder="Options (comma separated, e.g. 1kg, 2kg)"
                      value={newOption.optionsString}
                      onChange={(e) => setNewOption({ ...newOption, optionsString: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d2d2d7', marginBottom: '12px' }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={newOption.required}
                        onChange={(e) => setNewOption({ ...newOption, required: e.target.checked })}
                      />
                      Required
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      style={{ background: '#0071e3', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Add Option
                    </button>
                  </div>
                </div>

                {formData.customizationOptions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {formData.customizationOptions.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'white', border: '1px solid #d2d2d7', borderRadius: '8px' }}>
                        <div>
                          <strong>{opt.name}</strong> ({opt.type})
                          {opt.required && <span style={{ color: '#ff3b30', marginLeft: '4px' }}>*</span>}
                          {opt.type === 'select' && <div style={{ fontSize: '12px', color: '#86868b' }}>{opt.options.join(', ')}</div>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          style={{ color: '#ff3b30', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Image Upload</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {formData.imageData && (
                  <img src={formData.imageData} alt="Preview" className={styles.preview} />
                )}
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
