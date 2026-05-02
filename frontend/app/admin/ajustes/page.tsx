'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  Save, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchConfigs, adminUpdateConfigs, uploadImage } from '@/lib/api';

export default function AdminConfigPage() {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFavicon, setSelectedFavicon] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewFaviconUrl, setPreviewFaviconUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      const data = await fetchConfigs();
      setConfigs(data);
      if (data.site_logo) setPreviewUrl(data.site_logo);
      if (data.site_favicon) setPreviewFaviconUrl(data.site_favicon);
    } catch (error) {
      console.error('Error loading configs:', error);
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

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFavicon(file);
      setPreviewFaviconUrl(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const newConfigs = {
      site_name: formData.get('site_name'),
      site_title: formData.get('site_title'),
      site_description: formData.get('site_description'),
      whatsapp: formData.get('whatsapp'),
      site_logo: configs.site_logo || '',
      site_favicon: configs.site_favicon || ''
    };

    try {
      // 1. Upload logo if changed
      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile, 'site', 'logo');
        newConfigs.site_logo = uploadRes.path;
      }

      if (selectedFavicon) {
        const uploadRes = await uploadImage(selectedFavicon, 'site', 'favicon');
        newConfigs.site_favicon = uploadRes.path;
      }

      // 2. Update all configs
      await adminUpdateConfigs(newConfigs);
      setConfigs(newConfigs);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating configs:', error);
      alert('Error al guardar las configuraciones');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 animate-pulse">Cargando ajustes...</div>;

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ajustes Generales</h2>
        <p className="text-sm text-[var(--muted)] mt-1">Configura la identidad y contacto de tu negocio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius2)] p-6 space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Logotipo del Sitio</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-[var(--border2)] bg-[var(--card2)] hover:border-[var(--accent)] transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-[var(--muted)] mx-auto mb-1" />
                  <p className="text-[9px] text-[var(--muted)] font-bold">Subir Logo</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <p className="text-[10px] text-[var(--muted)] italic">Se recomienda un logo con fondo transparente (PNG/WebP)</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Nombre del Negocio</label>
              <input 
                name="site_name" 
                defaultValue={configs.site_name}
                required
                className="w-full px-4 py-2.5 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Descripción Corta</label>
              <textarea 
                name="site_description" 
                defaultValue={configs.site_description}
                rows={2}
                className="w-full px-4 py-2.5 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">WhatsApp de Pedidos</label>
              <input 
                name="whatsapp" 
                defaultValue={configs.whatsapp}
                placeholder="+57 300 000 0000"
                className="w-full px-4 py-2.5 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[var(--accent)] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar Cambios</>}
          </button>
          
          {success && (
            <div className="flex items-center gap-2 text-[var(--success)] animate-in fade-in slide-in-from-left-4">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">¡Guardado con éxito!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
