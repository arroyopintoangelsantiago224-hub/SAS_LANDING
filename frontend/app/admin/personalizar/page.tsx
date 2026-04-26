'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Plus, 
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Eye,
  Upload,
  Eraser
} from 'lucide-react';
import { adminFetchBanners, adminSaveBanner, adminDeleteBanner, uploadImage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export default function AdminPersonalizarPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<any>(null);

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
      const data = await adminFetchBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading admin banners:', error);
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

  async function handleMove(id: number, direction: 'up' | 'down') {
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const newBanners = [...banners];
    [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
    
    setBanners(newBanners);

    try {
      await Promise.all([
        adminSaveBanner({ ...newBanners[index], orden: index }),
        adminSaveBanner({ ...newBanners[newIndex], orden: newIndex })
      ]);
    } catch (error) {
      console.error('Error saving banner order:', error);
      loadData();
    }
  }

  async function handleDelete() {
    if (!bannerToDelete) return;
    try {
      await adminDeleteBanner(bannerToDelete.id);
      setBanners(banners.filter(b => b.id !== bannerToDelete.id));
      setIsDeleting(false);
      setBannerToDelete(null);
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData(e.currentTarget);
    
    let currentImageUrl = previewUrl.startsWith('blob:') || !previewUrl ? (editingBanner?.imagen_url || '') : previewUrl;
    if (!previewUrl) currentImageUrl = '';

    const bannerData = {
      ...editingBanner,
      titulo: formData.get('titulo'),
      subtitulo: formData.get('subtitulo'),
      imagen_url: currentImageUrl,
      activo: true,
      orden: editingBanner?.orden || banners.length
    };

    try {
      const savedBanner = await adminSaveBanner(bannerData);
      const bannerId = savedBanner.id;

      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile, 'banners', bannerId);
        await adminSaveBanner({
          ...savedBanner,
          imagen_url: uploadRes.url
        });
      }

      loadData();
      closeModal();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error al guardar el banner');
    } finally {
      setIsUploading(false);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingBanner(null);
    setSelectedFile(null);
    setPreviewUrl('');
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Carrusel Principal</h2>
          <p className="text-sm text-[var(--muted)] mt-1">Gestiona las imágenes y textos del carrusel</p>
        </div>
        <button 
          onClick={() => { closeModal(); setIsModalOpen(true); }}
          className="px-6 py-2 bg-[var(--accent)] text-black font-bold text-sm rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          style={{ boxShadow: `0 8px 16px -4px var(--accent)` }}
        >
          <Plus className="w-4 h-4" />
          Añadir Banner
        </button>
      </div>

      {/* Banner Preview Area */}
      {banners.length > 0 && (
        <div className="relative aspect-[21/9] w-full rounded-[var(--radius2)] overflow-hidden border border-[var(--border)] bg-[var(--card2)] group">
          <img 
            src={banners[0].imagen_url} 
            alt="Preview" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
          
          <div className="relative z-20 h-full container mx-auto px-12 flex flex-col justify-center">
            <div className="max-w-md space-y-2">
              <h3 className="text-3xl font-black text-white leading-tight">{banners[0].titulo}</h3>
              <p className="text-white/70 text-sm">{banners[0].subtitulo}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
            Vista Previa (Banner #1)
          </div>
        </div>
      )}

      {/* Banner List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="h-20 bg-[var(--card)] animate-pulse rounded-xl border border-[var(--border)]" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {banners.map((banner, index) => (
              <div key={banner.id} className="flex items-center gap-4 p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl group hover:border-[var(--border2)] transition-all">
                <div className="w-24 h-14 rounded-lg overflow-hidden bg-[var(--card2)] flex-shrink-0">
                  <img src={banner.imagen_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm truncate">{banner.titulo || 'Sin título'}</h4>
                    {index === 0 && <span className="px-2 py-0.5 rounded bg-[var(--accent-dim)] text-[var(--accent)] text-[9px] font-bold uppercase tracking-wider">Principal</span>}
                  </div>
                  <p className="text-[10px] font-mono text-[var(--muted)] truncate mt-0.5">{banner.imagen_url}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handleMove(banner.id, 'up')} disabled={index === 0} className="p-1 text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleMove(banner.id, 'down')} disabled={index === banners.length - 1} className="p-1 text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="h-8 w-px bg-[var(--border)] mx-1" />
                  <button onClick={() => { setEditingBanner(banner); setPreviewUrl(banner.imagen_url || ''); setIsModalOpen(true); }} className="p-2 text-[var(--info)] hover:bg-[var(--card2)] rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { setBannerToDelete(banner); setIsDeleting(true); }} className="p-2 text-[var(--danger)] hover:bg-[var(--card2)] rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Banner Modal - Reduced Size */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--surface)] w-full max-w-sm rounded-2xl border border-[var(--border2)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-bold text-sm">{editingBanner ? 'Editar Banner' : 'Añadir Banner'}</h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-[var(--card)] rounded-lg text-[var(--muted)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar">
              {/* Image Upload Area */}
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Imagen</label>
                  {previewUrl && (
                    <button type="button" onClick={removeImage} className="text-[9px] font-bold text-[var(--danger)] flex items-center gap-1 hover:underline">
                      <Eraser className="w-3 h-3" />
                      Eliminar
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
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-1">
                      <ImageIcon className="w-5 h-5 text-[var(--muted)] mx-auto" />
                      <p className="text-[10px] text-[var(--muted)]">Click para subir</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <input 
                  name="imagen_url" 
                  value={previewUrl.startsWith('blob:') ? '' : previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  placeholder="O pega URL externa..."
                  className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border2)] rounded-lg text-xs focus:border-[var(--accent)] outline-none mt-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Título</label>
                <input name="titulo" defaultValue={editingBanner?.titulo} className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border2)] rounded-lg text-xs focus:border-[var(--accent)] outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Subtítulo</label>
                <input name="subtitulo" defaultValue={editingBanner?.subtitulo} className="w-full px-3 py-2 bg-[var(--card)] border border-[var(--border2)] rounded-lg text-xs focus:border-[var(--accent)] outline-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2 text-xs font-bold border border-[var(--border2)] rounded-lg hover:bg-[var(--card)] transition-all">Cancelar</button>
                <button type="submit" disabled={isUploading} className="flex-1 py-2 text-xs font-bold bg-[var(--accent)] text-black rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg disabled:opacity-50">
                  {isUploading ? 'Guardando...' : 'Guardar'}
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
            <Trash2 className="w-8 h-8 text-[var(--danger)] mx-auto mb-6 opacity-20" />
            <h3 className="text-lg font-bold mb-2">¿Eliminar banner?</h3>
            <p className="text-xs text-[var(--muted)] mb-8">Esta imagen dejará de aparecer en el carrusel.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleting(false)} className="flex-1 py-2 text-xs font-bold border border-[var(--border2)] rounded-lg hover:bg-[var(--card)] transition-all">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-xs font-bold bg-[var(--danger)] text-white rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
