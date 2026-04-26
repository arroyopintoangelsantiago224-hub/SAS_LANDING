'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2,
  TrendingUp,
  Tag,
  DollarSign,
  X,
  Upload,
  Image as ImageIcon,
  Eraser
} from 'lucide-react';
import { adminFetchProducts, adminDeleteProduct, adminSaveProduct, fetchCategories, uploadImage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  
  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        adminFetchProducts(),
        fetchCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading admin products:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  async function handleDelete() {
    if (!productToDelete) return;
    try {
      await adminDeleteProduct(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleting(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    
    // Initial data from form
    let finalImageUrl = previewUrl.startsWith('blob:') || !previewUrl ? (editingProduct?.imagen_url || '') : previewUrl;

    // Handle image removal if preview was cleared
    if (!previewUrl) {
      finalImageUrl = '';
    }

    let productData = {
      ...editingProduct,
      nombre: formData.get('nombre'),
      precio: formData.get('precio'),
      categoria_id: formData.get('categoria_id'),
      descripcion: formData.get('descripcion'),
      imagen_url: finalImageUrl,
    };

    try {
      // 1. Save product first
      const savedProduct = await adminSaveProduct(productData);
      const productId = savedProduct.id;

      // 2. If there's a NEW file selected, upload it
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile, 'items', productId);
        
        // 3. Update with final URL
        await adminSaveProduct({
          ...savedProduct,
          imagen_url: uploadRes.url
        });
      }

      loadData();
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
    } finally {
      setIsUploading(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
    setPreviewUrl('');
  }

  const filteredProducts = products.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Productos', value: products.length, icon: Package, color: 'var(--accent)' },
    { label: 'Categorías', value: categories.length, icon: Tag, color: 'var(--info)' },
    { label: 'Precio Promedio', value: `$${products.length ? (products.reduce((acc, p) => acc + Number(p.precio), 0) / products.length).toFixed(2) : '0.00'}`, icon: TrendingUp, color: 'var(--success)' },
    { label: 'Valor Inventario', value: `$${products.reduce((acc, p) => acc + Number(p.precio), 0).toFixed(2)}`, icon: DollarSign, color: 'var(--accent)' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-[var(--radius2)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">{stat.label}</p>
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold tracking-tight" style={{ color: i === 0 ? 'var(--accent)' : 'inherit' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
          />
        </div>
        <button 
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="w-full sm:w-auto px-6 py-2 bg-[var(--accent)] text-black font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          style={{ boxShadow: `0 8px 16px -4px var(--accent)` }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-[var(--card)] animate-pulse rounded-[var(--radius2)] border border-[var(--border)]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius2)] overflow-hidden hover:border-[var(--border2)] transition-all group shadow-sm">
              <div className="aspect-video relative bg-[var(--card2)]">
                {product.imagen_url ? (
                  <img src={product.imagen_url} alt={product.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted2)]">
                    <Package className="w-8 h-8 opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingProduct(product); setPreviewUrl(product.imagen_url || ''); setIsModalOpen(true); }}
                    className="p-2 bg-[var(--surface)] text-[var(--info)] rounded-lg shadow-lg hover:scale-110 active:scale-90 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setProductToDelete(product); setIsDeleting(true); }}
                    className="p-2 bg-[var(--surface)] text-[var(--danger)] rounded-lg shadow-lg hover:scale-110 active:scale-90 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)] mb-1">
                  {categories.find(c => c.id === product.categoria_id)?.nombre || 'Sin Categoría'}
                </p>
                <h3 className="font-bold text-sm truncate mb-3">{product.nombre}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-lg text-[var(--accent)]">${Number(product.precio).toFixed(2)}</span>
                  <div className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    product.disponible ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {product.disponible ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-2xl border border-[var(--border2)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              {/* Image Upload Area */}
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Imagen del Producto</label>
                  {previewUrl && (
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="text-[9px] font-bold text-[var(--danger)] flex items-center gap-1 hover:underline"
                    >
                      <Eraser className="w-3 h-3" />
                      Eliminar Imagen
                    </button>
                  )}
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-xl border-2 border-dashed border-[var(--border2)] bg-[var(--card)] hover:border-[var(--accent)] transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-[var(--card2)] rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="w-6 h-6 text-[var(--muted)]" />
                      </div>
                      <p className="text-xs text-[var(--muted)]">Click para subir imagen local</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div className="relative mt-2">
                  <span className="text-[9px] text-[var(--muted)] absolute -top-2 left-3 bg-[var(--surface)] px-1">O usar URL externa</span>
                  <input 
                    name="imagen_url" 
                    value={previewUrl.startsWith('blob:') ? '' : previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Nombre</label>
                  <input 
                    name="nombre" 
                    required 
                    defaultValue={editingProduct?.nombre}
                    className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Precio</label>
                  <input 
                    name="precio" 
                    type="number" 
                    step="0.01" 
                    required 
                    defaultValue={editingProduct?.precio}
                    className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Categoría</label>
                <select 
                  name="categoria_id" 
                  required 
                  defaultValue={editingProduct?.categoria_id}
                  className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none appearance-none"
                >
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Descripción</label>
                <textarea 
                  name="descripcion" 
                  rows={3} 
                  defaultValue={editingProduct?.descripcion}
                  className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 py-3 text-sm font-bold border border-[var(--border2)] rounded-xl hover:bg-[var(--card)] transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 text-sm font-bold bg-[var(--accent)] text-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50"
                >
                  {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] w-full max-sm rounded-2xl border border-[var(--danger)]/30 p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[var(--danger)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-[var(--danger)]" />
            </div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar producto?</h3>
            <p className="text-sm text-[var(--muted)] mb-8">Esta acción no se puede deshacer. Se eliminará "{productToDelete?.nombre}" permanentemente.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-3 text-sm font-bold border border-[var(--border2)] rounded-xl hover:bg-[var(--card)] transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 text-sm font-bold bg-[var(--danger)] text-white rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
