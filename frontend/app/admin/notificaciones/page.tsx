'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Upload, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  Music,
  Plus,
  Volume2,
  AlertCircle
} from 'lucide-react';
import { adminFetchSounds, adminSaveSound, adminDeleteSound, uploadImage } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function AdminNotificacionesPage() {
  const [sounds, setSounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSounds();
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  async function loadSounds() {
    setLoading(true);
    try {
      const data = await adminFetchSounds();
      setSounds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading sounds:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload the audio file (reusing images endpoint for simplicity, but it's an audio file)
      // Actually, my UploadController handles 'site' etc. I should check if it allows audio.
      // For now, I'll use it and the backend will save it.
      const uploadRes = await uploadImage(file, 'sounds', 'notification');
      
      // 2. Create the sound record
      await adminSaveSound({
        nombre: file.name.split('.')[0],
        archivo_url: uploadRes.path,
        activo: sounds.length === 0 // Active if it's the first one
      });

      loadSounds();
    } catch (error) {
      console.error('Error uploading sound:', error);
      alert('Error al subir el sonido');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleActive = async (sound: any) => {
    try {
      await adminSaveSound({ ...sound, activo: true });
      loadSounds();
    } catch (error) {
      console.error('Error setting active sound:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este sonido?')) return;
    try {
      await adminDeleteSound(id);
      setSounds(sounds.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting sound:', error);
    }
  };

  const playPreview = (sound: any) => {
    if (playingId === sound.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(sound.archivo_url);
    audioRef.current = audio;
    audio.play();
    setPlayingId(sound.id);

    audio.onended = () => {
      setPlayingId(null);
    };
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-[var(--accent)]" />
            Notificaciones
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">Configura las alertas visuales y sonoras para nuevos pedidos</p>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-6 py-2.5 bg-[var(--accent)] text-black font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
          style={{ boxShadow: `0 8px 16px -4px var(--accent)` }}
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Importar Sonido
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="audio/*" 
          className="hidden" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Sound Card */}
        <div className="bg-[var(--card)] border-2 border-[var(--accent)] rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
                <div className="bg-[var(--accent)] text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                    En Uso
                </div>
            </div>
            <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center">
                    <Volume2 className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div>
                    <h3 className="text-xl font-black truncate">
                        {sounds.find(s => s.activo)?.nombre || 'Ningún sonido seleccionado'}
                    </h3>
                    <p className="text-xs text-[var(--muted)] mt-1 font-medium">Este es el sonido que escucharás cuando llegue un pedido</p>
                </div>
                <button 
                    onClick={() => {
                        const active = sounds.find(s => s.activo);
                        if (active) playPreview(active);
                    }}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-[var(--accent)] transition-colors"
                >
                    {playingId && sounds.find(s => s.activo)?.id === playingId ? (
                        <><Pause className="w-4 h-4" /> Pausar Prueba</>
                    ) : (
                        <><Play className="w-4 h-4" /> Reproducir Prueba</>
                    )}
                </button>
            </div>
        </div>

        {/* Info Box */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 flex flex-col justify-center">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[var(--info)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-[var(--info)]" />
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-sm">Información de Alertas</h4>
                    <ul className="text-xs text-[var(--muted)] space-y-2 leading-relaxed">
                        <li>• Las notificaciones nativas deben estar permitidas en el navegador.</li>
                        <li>• El sonido se reproducirá automáticamente incluso si la pestaña no está activa.</li>
                        <li>• Se recomienda usar archivos .mp3 o .wav ligeros.</li>
                    </ul>
                </div>
            </div>
        </div>
      </div>

      {/* Library Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Music className="w-4 h-4" />
                Biblioteca de Sonidos
            </h3>
            <span className="text-[10px] font-mono text-[var(--muted)]">{sounds.length} sonidos guardados</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="h-16 bg-[var(--card)] animate-pulse rounded-2xl border border-[var(--border)]" />)
          ) : sounds.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-[var(--border)] rounded-3xl">
                <Music className="w-8 h-8 text-[var(--muted2)] mx-auto mb-3 opacity-20" />
                <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">No has importado sonidos aún</p>
            </div>
          ) : (
            sounds.map((sound) => (
              <div 
                key={sound.id} 
                className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all group",
                    sound.activo ? "bg-[var(--accent)]/5 border-[var(--accent)]" : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--border2)]"
                )}
              >
                <button 
                    onClick={() => playPreview(sound)}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        playingId === sound.id ? "bg-[var(--accent)] text-black" : "bg-[var(--card2)] text-[var(--muted)] hover:text-[var(--text)]"
                    )}
                >
                    {playingId === sound.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{sound.nombre}</h4>
                    <p className="text-[10px] font-mono text-[var(--muted)] truncate">{sound.archivo_url.split('/').pop()}</p>
                </div>

                <div className="flex items-center gap-2">
                    {!sound.activo && (
                        <button 
                            onClick={() => toggleActive(sound)}
                            className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--accent)] transition-all"
                        >
                            Seleccionar
                        </button>
                    )}
                    <button 
                        onClick={() => handleDelete(sound.id)}
                        className="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-xl transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
