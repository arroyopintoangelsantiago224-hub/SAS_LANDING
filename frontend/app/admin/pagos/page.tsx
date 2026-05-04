'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Save, 
  ToggleLeft, 
  ToggleRight, 
  QrCode, 
  Building2, 
  HandCoins,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { adminFetchPaymentMethods, adminSavePaymentMethod, adminDeletePaymentMethod, uploadImage } from '@/lib/api';
import { ImageUpload } from '@/components/ImageUpload';


const AVAILABLE_FIELDS = [
  { key: 'telefono', label: 'Teléfono / Celular', group: 'qr' },
  { key: 'qr_imagen', label: 'Imagen de QR', group: 'qr' },
  { key: 'banco', label: 'Nombre del Banco', group: 'banco' },
  { key: 'tipo_cuenta', label: 'Tipo de Cuenta', group: 'banco' },
  { key: 'numero_cuenta', label: 'Número de Cuenta', group: 'banco' },
  { key: 'titular', label: 'Titular de la Cuenta', group: 'general' },
  { key: 'instrucciones', label: 'Instrucciones Adicionales', group: 'general' },
];

export default function AdminPaymentsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedQRFile, setSelectedQRFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewQRUrl, setPreviewQRUrl] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const qrInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMethods();
  }, []);

  async function loadMethods() {
    try {
      const data = await adminFetchPaymentMethods();
      setMethods(data);
    } catch (error) {
      console.error('Error loading methods:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (method: any) => {
    setEditingMethod({
      ...method,
      configuracion_campos: method.configuracion_campos || {
        telefono: method.tipo === 'qr',
        qr_imagen: method.tipo === 'qr',
        banco: method.tipo === 'transferencia',
        tipo_cuenta: method.tipo === 'transferencia',
        numero_cuenta: method.tipo === 'transferencia',
        titular: method.tipo !== 'contraentrega',
        instrucciones: true
      }
    });
    setPreviewUrl(method.icono || '');
    setPreviewQRUrl(method.qr_imagen || '');
    setSelectedFile(null);
    setSelectedQRFile(null);
  };

  const handleCreate = () => {
    setEditingMethod({
      nombre: '',
      tipo: 'transferencia',
      icono: '',
      activo: true,
      configuracion_campos: {
        telefono: false,
        qr_imagen: false,
        banco: true,
        tipo_cuenta: true,
        numero_cuenta: true,
        titular: true,
        instrucciones: true
      }
    });
    setPreviewUrl('');
    setPreviewQRUrl('');
    setSelectedFile(null);
    setSelectedQRFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleQRFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedQRFile(file);
      setPreviewQRUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let iconUrl = editingMethod.icono;
      let qrUrl = editingMethod.qr_imagen;

      if (selectedFile) {
        const uploadRes = await uploadImage(selectedFile, 'pagos', editingMethod.id);
        iconUrl = uploadRes.path;
      }

      if (selectedQRFile) {
        const uploadRes = await uploadImage(selectedQRFile, 'pagos', editingMethod.id);
        qrUrl = uploadRes.path;
      }

      await adminSavePaymentMethod({
        ...editingMethod,
        icono: iconUrl,
        qr_imagen: qrUrl
      });
      
      setEditingMethod(null);
      loadMethods();
    } catch (error) {
      console.error('Error saving method:', error);
      alert('Error al guardar el método de pago');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este método de pago?')) return;
    try {
      await adminDeletePaymentMethod(id);
      loadMethods();
    } catch (error) {
      console.error('Error deleting method:', error);
    }
  };

  const toggleField = (key: string) => {
    setEditingMethod({
      ...editingMethod,
      configuracion_campos: {
        ...editingMethod.configuracion_campos,
        [key]: !editingMethod.configuracion_campos[key]
      }
    });
  };

  if (loading) return <div className="p-8 animate-pulse text-[var(--muted)] font-mono uppercase text-xs">Cargando métodos de pago...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">Métodos de Pago</h2>
          <p className="text-sm text-[var(--muted)] mt-1 font-medium">Configura cómo tus clientes pueden pagar sus pedidos</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--accent)]/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Método
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => (
          <div 
            key={method.id}
            className="group relative bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 hover:border-[var(--accent)] transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--card2)] border border-[var(--border2)] p-2 flex items-center justify-center overflow-hidden">
                  {method.icono ? (
                    <img src={method.icono} alt={method.nombre} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-[var(--muted2)]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">{method.nombre}</h3>
                  <span className="text-[10px] font-mono uppercase text-[var(--muted)] tracking-widest">{method.tipo}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${method.activo ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--muted)]/10 text-[var(--muted)]'}`}>
                {method.activo ? 'Activo' : 'Inactivo'}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-[10px] text-[var(--muted)] font-medium italic line-clamp-2">
                {method.instrucciones || 'Sin instrucciones adicionales'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-[var(--border2)]">
              <button 
                onClick={() => handleEdit(method)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--card2)] hover:bg-[var(--accent)] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Settings2 className="w-3 h-3" /> Configurar
              </button>
              <button 
                onClick={() => handleDelete(method.id)}
                className="w-10 h-10 flex items-center justify-center text-[var(--error)] bg-[var(--error)]/5 hover:bg-[var(--error)] hover:text-white rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {methods.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[var(--border2)] rounded-[3rem]">
            <CreditCard className="w-12 h-12 text-[var(--muted2)] mx-auto mb-4 opacity-20" />
            <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">No hay métodos de pago configurados</p>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editingMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[var(--card)] border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 z-10 bg-[var(--card)]/80 backdrop-blur-md border-b border-[var(--border)] p-6 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                {editingMethod.id ? 'Editar Método' : 'Nuevo Método'}
              </h3>
              <button 
                onClick={() => setEditingMethod(null)}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--card2)] rounded-full text-[var(--muted)] hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <ImageUpload 
                    label="Icono (Opcional)"
                    previewUrl={previewUrl}
                    aspectRatio="aspect-square w-20 h-20"
                    onFileSelect={(file) => {
                      setSelectedFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                    onRemove={() => {
                      setPreviewUrl('');
                      setSelectedFile(null);
                      setEditingMethod({...editingMethod, icono: ''});
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Nombre</label>
                  <input 
                    value={editingMethod.nombre}
                    onChange={(e) => setEditingMethod({...editingMethod, nombre: e.target.value})}
                    placeholder="Ej: Nequi, Transferencia Bancaria..."
                    className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Tipo de Método</label>
                  <select 
                    value={editingMethod.tipo}
                    onChange={(e) => setEditingMethod({...editingMethod, tipo: e.target.value})}
                    className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm focus:border-[var(--accent)] outline-none appearance-none"
                  >
                    <option value="qr">Billetera / QR</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="contraentrega">Contraentrega</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Estado</label>
                  <button 
                    onClick={() => setEditingMethod({...editingMethod, activo: !editingMethod.activo})}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all w-full ${editingMethod.activo ? 'border-[var(--success)]/50 bg-[var(--success)]/5 text-[var(--success)]' : 'border-[var(--muted)]/50 bg-[var(--card2)] text-[var(--muted)]'}`}
                  >
                    {editingMethod.activo ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{editingMethod.activo ? 'Activo' : 'Inactivo'}</span>
                  </button>
                </div>
              </div>

              {/* Fields Activation */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[var(--accent)]" />
                  <label className="text-xs font-black uppercase tracking-widest">Configuración de Campos</label>
                </div>
                <p className="text-[10px] text-[var(--muted)] italic -mt-2">Activa los campos que quieres que el cliente vea al pagar</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_FIELDS.map((field) => (
                    <button 
                      key={field.key}
                      onClick={() => toggleField(field.key)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${editingMethod.configuracion_campos[field.key] ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-white' : 'border-[var(--border2)] bg-[var(--card2)] text-[var(--muted)]'}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">{field.label}</span>
                      {editingMethod.configuracion_campos[field.key] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Values (Data) */}
              <div className="space-y-6 pt-6 border-t border-[var(--border2)]">
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4 text-[var(--accent)]" />
                  <label className="text-xs font-black uppercase tracking-widest">Datos del Método</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editingMethod.configuracion_campos.telefono && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Número de Celular</label>
                      <input 
                        value={editingMethod.telefono || ''}
                        onChange={(e) => setEditingMethod({...editingMethod, telefono: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm outline-none"
                      />
                    </div>
                  )}

                  {editingMethod.configuracion_campos.banco && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Banco</label>
                      <input 
                        value={editingMethod.banco || ''}
                        onChange={(e) => setEditingMethod({...editingMethod, banco: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm outline-none"
                      />
                    </div>
                  )}

                  {editingMethod.configuracion_campos.numero_cuenta && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Número de Cuenta</label>
                      <input 
                        value={editingMethod.numero_cuenta || ''}
                        onChange={(e) => setEditingMethod({...editingMethod, numero_cuenta: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm outline-none"
                      />
                    </div>
                  )}

                  {editingMethod.configuracion_campos.tipo_cuenta && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Tipo de Cuenta</label>
                      <select 
                        value={editingMethod.tipo_cuenta || 'ahorros'}
                        onChange={(e) => setEditingMethod({...editingMethod, tipo_cuenta: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm outline-none appearance-none"
                      >
                        <option value="ahorros">Ahorros</option>
                        <option value="corriente">Corriente</option>
                      </select>
                    </div>
                  )}

                  {editingMethod.configuracion_campos.qr_imagen && (
                    <div className="space-y-2">
                      <ImageUpload 
                        label="Imagen QR"
                        previewUrl={previewQRUrl}
                        aspectRatio="aspect-square w-24 h-24"
                        onFileSelect={(file) => {
                          setSelectedQRFile(file);
                          setPreviewQRUrl(URL.createObjectURL(file));
                        }}
                        onRemove={() => {
                          setPreviewQRUrl('');
                          setSelectedQRFile(null);
                          setEditingMethod({...editingMethod, qr_imagen: ''});
                        }}
                      />
                    </div>
                  )}

                  {editingMethod.configuracion_campos.titular && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Titular</label>
                      <input 
                        value={editingMethod.titular || ''}
                        onChange={(e) => setEditingMethod({...editingMethod, titular: e.target.value})}
                        className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm outline-none"
                      />
                    </div>
                  )}
                </div>

                {editingMethod.configuracion_campos.instrucciones && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">Instrucciones</label>
                    <textarea 
                      value={editingMethod.instrucciones || ''}
                      onChange={(e) => setEditingMethod({...editingMethod, instrucciones: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-[var(--card2)] border border-[var(--border2)] rounded-xl text-sm outline-none resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-4 bg-[var(--accent)] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[var(--accent)]/20"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button 
                  onClick={() => setEditingMethod(null)}
                  className="px-8 py-4 bg-[var(--card2)] text-[var(--muted)] font-black text-xs uppercase tracking-widest rounded-2xl hover:text-white transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
