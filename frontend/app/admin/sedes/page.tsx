'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Loader2,
  Phone,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import { adminFetchSedes, adminSaveSede, adminDeleteSede } from '@/lib/api';

interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

export default function SedesPage() {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: ''
  });

  const fetchSedes = async () => {
    try {
      const data = await adminFetchSedes();
      setSedes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Error al cargar las sedes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSede ? 'PUT' : 'POST';
    const url = editingSede 
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/sedes/${editingSede.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/sedes`;

    try {
      await adminSaveSede({
        ...formData,
        id: editingSede?.id
      });

      toast.success(editingSede ? 'Sede actualizada' : 'Sede creada');
      setIsModalOpen(false);
      setEditingSede(null);
      setFormData({ nombre: '', direccion: '', telefono: '' });
      fetchSedes();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar la sede');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta sede?')) return;

    try {
      await adminDeleteSede(id);
      toast.success('Sede eliminada');
      fetchSedes();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const openEdit = (sede: Sede) => {
    setEditingSede(sede);
    setFormData({
      nombre: sede.nombre,
      direccion: sede.direccion,
      telefono: sede.telefono
    });
    setIsModalOpen(true);
  };

  const filteredSedes = sedes.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Sedes del Negocio</h1>
          <p className="text-[var(--muted2)] font-medium">Gestiona las ubicaciones físicas de tu establecimiento</p>
        </div>
        <button 
          onClick={() => {
            setEditingSede(null);
            setFormData({ nombre: '', direccion: '', telefono: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[var(--accent)] text-black px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-lg shadow-[var(--accent)]/20"
        >
          <Plus className="w-5 h-5" />
          Nueva Sede
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted2)]" />
        <input 
          type="text" 
          placeholder="Buscar sede por nombre o dirección..."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
          <span className="font-bold text-[var(--muted2)]">Cargando sedes...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSedes.map((sede) => (
            <div key={sede.id} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-3xl group hover:border-[var(--accent)] transition-all relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-2xl flex items-center justify-center group-hover:bg-[var(--accent)] transition-all">
                  <MapPin className="w-6 h-6 text-[var(--accent)] group-hover:text-black transition-all" />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEdit(sede)}
                    className="p-2 hover:bg-[var(--card2)] rounded-xl text-[var(--muted2)] hover:text-[var(--accent)] transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(sede.id)}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-[var(--muted2)] hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black mb-1">{sede.nombre}</h3>
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--muted)]">
                  <Navigation className="w-4 h-4 text-[var(--accent)]" />
                  {sede.direccion}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-[var(--muted)]">
                  <Phone className="w-4 h-4 text-[var(--accent)]" />
                  {sede.telefono}
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[var(--accent)]/10 transition-all" />
            </div>
          ))}

          {filteredSedes.length === 0 && (
            <div className="col-span-full py-20 text-center bg-[var(--card2)] rounded-3xl border-2 border-dashed border-[var(--border)]">
              <MapPin className="w-12 h-12 text-[var(--muted2)] mx-auto mb-4 opacity-20" />
              <p className="text-[var(--muted2)] font-bold italic">No se encontraron sedes</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-[32px] p-8 shadow-2xl border border-[var(--border)] animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black mb-6">
              {editingSede ? 'Editar Sede' : 'Nueva Sede'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted2)] ml-1">Nombre de la Sede</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder="Ej: Sede Central"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted2)] ml-1">Dirección</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder="Calle 123 # 45 - 67"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted2)] ml-1">Teléfono de contacto</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder="+57 300 000 0000"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-sm bg-[var(--card2)] text-[var(--text)] hover:bg-[var(--border)] transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-2xl font-black text-sm bg-[var(--accent)] text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent)]/20"
                >
                  {editingSede ? 'Guardar Cambios' : 'Crear Sede'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
