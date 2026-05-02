'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Tag,
  X,
  Upload,
  Image as ImageIcon,
  Eraser,
  AlertTriangle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  adminFetchProducts, 
  adminDeleteProduct, 
  adminSaveProduct, 
  adminFetchCategories, 
  adminSaveCategory, 
  adminDeleteCategory, 
  uploadImage 
} from '@/lib/api';
import { cn } from '@/lib/utils';

export default function AdminItemsPage() {
  const [activeTab, setActiveTab] = useState<'productos' | 'categorias'>('productos');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Deletion Modals
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteError, setDeleteError] = useState<{message: string, count: number} | null>(null);

  // Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        adminFetchProducts(),
        adminFetchCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading admin items:', error);
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

  async function handleDeleteConfirm(force: boolean = false) {
    if (!itemToDelete) return;
    setIsSaving(true);
    try {
      if (activeTab === 'productos') {
        await adminDeleteProduct(itemToDelete.id);
      } else {
        const res = await adminDeleteCategory(itemToDelete.id, force);
        if (res.error === 'Conflict') {
          setDeleteError({ message: res.message, count: res.product_count });
          setIsSaving(false);
          return;
        }
      }
      
      loadData();
      setIsDeleting(false);
      setItemToDelete(null);
      setDeleteError(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let currentImageUrl = previewUrl.startsWith('blob:') || !previewUrl ? (editingItem?.imagen_url || '') : previewUrl;
    if (!previewUrl) currentImageUrl = '';

    const productData = {
      ...editingItem,
      nombre: formData.get('nombre'),
      precio: formData.get('precio'),
      categoria_id: formData.get('categoria_id'),
      descripcion: formData.get('descripcion'),
      imagen_url: currentImageUrl,
    };

    try {
      const saved = await adminSaveProduct(productData);
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile, 'items', saved.id);
        await adminSaveProduct({ ...saved, imagen_url: uploadRes.path });
      }
      loadData();
      closeModals();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    let currentImageUrl = previewUrl.startsWith('blob:') || !previewUrl ? (editingItem?.imagen_url || '') : previewUrl;
    if (!previewUrl) currentImageUrl = '';

    const categoryData = {
      ...editingItem,
      nombre: formData.get('nombre'),
      descripcion: formData.get('descripcion'),
      imagen_url: currentImageUrl,
      activa: true
    };

    try {
      const saved = await adminSaveCategory(categoryData);
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile, 'items', `cat_${saved.id}`);
        await adminSaveCategory({ ...saved, imagen_url: uploadRes.path });
      }
      loadData();
      closeModals();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  }

  function closeModals() {
    setIsProductModalOpen(false);
    setIsCategoryModalOpen(false);
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setDeleteError(null);
  }

  const filteredItems = (activeTab === 'productos' ? products : categories).filter(item => 
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Gestión de Catálogo</h2>
          <p className="text-sm text-[var(--muted)] mt-1">Administra tus productos y las categorías que los organizan</p>
        </div>
        
        <div className="flex bg-[var(--card)] p-1 rounded-2xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab('productos')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'productos' ? "bg-[var(--accent)] text-black shadow-lg" : "text-[var(--muted)] hover:text-[var(--text)]"
            )}
          >
            Productos
          </button>
          <button 
            onClick={() => setActiveTab('categorias')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'categorias' ? "bg-[var(--accent)] text-black shadow-lg" : "text-[var(--muted)] hover:text-[var(--text)]"
            )}
          >
            Categorías
          </button>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input 
            type="text" 
            placeholder={`Buscar ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card)] border border-[var(--border)] rounded-xl text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
          />
        </div>
        <button 
          onClick={() => { 
            setEditingItem(null); 
            if (activeTab === 'productos') setIsProductModalOpen(true);
            else setIsCategoryModalOpen(true);
          }}
          className="w-full sm:w-auto px-8 py-2.5 bg-[var(--accent)] text-black font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          style={{ boxShadow: `0 8px 16px -4px var(--accent)` }}
        >
          <Plus className="w-4 h-4" />
          Nuevo {activeTab === 'productos' ? 'Producto' : 'Categoría'}
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="aspect-[4/5] bg-[var(--card)] animate-pulse rounded-2xl border border-[var(--border)]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border2)] transition-all group shadow-sm">
              <div className="aspect-video relative bg-[var(--card2)]">
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted2)]">
                    {activeTab === 'productos' ? <Package className="w-8 h-8 opacity-20" /> : <Tag className="w-8 h-8 opacity-20" />}
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { 
                      setEditingItem(item); 
                      setPreviewUrl(item.imagen_url || '');
                      if (activeTab === 'productos') setIsProductModalOpen(true);
                      else setIsCategoryModalOpen(true);
                    }}
                    className="p-2 bg-[var(--surface)] text-[var(--info)] rounded-lg shadow-lg hover:scale-110 active:scale-90 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setItemToDelete(item); setIsDeleting(true); }}
                    className="p-2 bg-[var(--surface)] text-[var(--danger)] rounded-lg shadow-lg hover:scale-110 active:scale-90 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">
                    {activeTab === 'productos' 
                      ? (categories.find(c => c.id === item.categoria_id)?.nombre || 'Sin Categoría')
                      : `${item.productos_count || 0} Productos`
                    }
                  </p>
                </div>
                <h3 className="font-black text-sm truncate mb-3">{item.nombre}</h3>
                {activeTab === 'productos' && (
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg text-[var(--accent)]">${Number(item.precio).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-3xl border border-[var(--border2)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-xs">{editingItem ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={closeModals} className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Imagen del Producto</label>
                  {previewUrl && (
                    <button type="button" onClick={removeImage} className="text-[9px] font-bold text-[var(--danger)] flex items-center gap-1 hover:underline">
                      <Eraser className="w-3 h-3" /> Eliminar
                    </button>
                  )}
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-video rounded-2xl border-2 border-dashed border-[var(--border2)] bg-[var(--card)] hover:border-[var(--accent)] transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
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
                      <ImageIcon className="w-6 h-6 text-[var(--muted)] mx-auto" />
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Click para subir</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Nombre</label>
                  <input name="nombre" required defaultValue={editingItem?.nombre} className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Precio</label>
                  <input name="precio" type="number" step="0.01" required defaultValue={editingItem?.precio} className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Categoría</label>
                <select name="categoria_id" required defaultValue={editingItem?.categoria_id} className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none">
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Descripción</label>
                <textarea name="descripcion" rows={3} defaultValue={editingItem?.descripcion} className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModals} className="flex-1 py-3 text-xs font-black uppercase tracking-widest border border-[var(--border2)] rounded-xl hover:bg-[var(--card)] transition-all">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-[var(--accent)] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-3xl border border-[var(--border2)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest text-xs">{editingItem ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={closeModals} className="p-2 hover:bg-[var(--card)] rounded-lg text-[var(--muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Nombre de Categoría</label>
                <input name="nombre" required defaultValue={editingItem?.nombre} className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Descripción</label>
                <textarea name="descripcion" rows={2} defaultValue={editingItem?.descripcion} className="w-full px-4 py-2.5 bg-[var(--card)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModals} className="flex-1 py-3 text-xs font-black uppercase tracking-widest border border-[var(--border2)] rounded-xl hover:bg-[var(--card)] transition-all">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-[var(--accent)] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">
                  {isSaving ? 'Guardar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-3xl border border-[var(--border2)] p-8 text-center animate-in zoom-in-95 duration-200">
            {deleteError ? (
              <>
                <div className="w-16 h-16 bg-[var(--danger)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-[var(--danger)]" />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-2">Acción Protegida</h3>
                <p className="text-sm text-[var(--muted)] mb-2">{deleteError.message}</p>
                <p className="text-[10px] font-bold text-[var(--danger)] uppercase tracking-widest mb-8 bg-red-500/5 py-2 rounded-lg border border-red-500/10 px-4">
                  Si continúas, se eliminarán permanentemente los {deleteError.count} productos de esta categoría.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleDeleteConfirm(true)}
                    disabled={isSaving}
                    className="w-full py-3 text-xs font-black uppercase tracking-widest bg-[var(--danger)] text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                  >
                    {isSaving ? 'Procesando...' : 'Sí, eliminar todo'}
                  </button>
                  <button 
                    onClick={() => { setIsDeleting(false); setDeleteError(null); }}
                    className="w-full py-3 text-xs font-black uppercase tracking-widest border border-[var(--border2)] rounded-xl hover:bg-[var(--card)] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-[var(--danger)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8 text-[var(--danger)]" />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-2">¿Eliminar {activeTab === 'productos' ? 'producto' : 'categoría'}?</h3>
                <p className="text-sm text-[var(--muted)] mb-8">Esta acción no se puede deshacer. Se eliminará permanentemente.</p>
                <div className="flex gap-3">
                  <button onClick={() => setIsDeleting(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest border border-[var(--border2)] rounded-xl hover:bg-[var(--card)] transition-all">Cancelar</button>
                  <button onClick={() => handleDeleteConfirm(false)} disabled={isSaving} className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-[var(--danger)] text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg">{isSaving ? '...' : 'Sí, eliminar'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
