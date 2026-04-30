'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  FileJson, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ShieldCheck,
  ChevronRight,
  Trash2,
  Settings,
  MapPin,
  SwitchCamera
} from 'lucide-react';
import { fetchConfigs, adminUpdateConfigs } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ApisPage() {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      const data = await fetchConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Error loading API configs:', error);
      toast.error('Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateConfigs(configs);
      toast.success('APIs actualizadas y archivos .env sincronizados');
    } catch (error) {
      console.error('Error saving APIs:', error);
      toast.error('Error al guardar las APIs');
    } finally {
      setSaving(false);
    }
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Google JSON format handling (can be web or installed)
        const web = json.web || json.installed;
        
        if (web && web.client_id && web.client_secret) {
          setConfigs({
            ...configs,
            google_client_id: web.client_id,
            google_client_secret: web.client_secret
          });
          toast.success('Credenciales de Google importadas correctamente');
        } else {
          toast.error('El archivo JSON no tiene el formato esperado de Google');
        }
      } catch (error) {
        toast.error('Error al leer el archivo JSON');
      }
    };
    reader.readAsText(file);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Mis APIs</h2>
          <p className="text-[var(--muted)] text-sm font-medium mt-1">Gestiona las conexiones externas y credenciales de tu tienda</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="cursor-pointer px-6 py-3 bg-[var(--card2)] hover:bg-[var(--border)] border border-[var(--border)] rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <FileJson className="w-4 h-4" />
            <span>Importar Google JSON</span>
            <input type="file" accept=".json" onChange={handleJsonImport} className="hidden" />
          </label>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-[var(--accent)] text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[var(--accent)]/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: API List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Google Login API */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Google OAuth</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)]">Autenticación y Login</p>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                configs.google_client_id ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-[var(--muted2)]/10 text-[var(--muted2)]"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", configs.google_client_id ? "bg-[var(--success)] animate-pulse" : "bg-[var(--muted2)]")} />
                {configs.google_client_id ? 'Configurado' : 'Pendiente'}
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)] ml-1">Client ID</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                    <input 
                      type="text"
                      value={configs.google_client_id || ''}
                      onChange={(e) => setConfigs({...configs, google_client_id: e.target.value})}
                      placeholder="00000000000-xxxxxxxxxxxx.apps.googleusercontent.com"
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-[var(--accent)] transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)] ml-1">Client Secret</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                    <input 
                      type="password"
                      value={configs.google_client_secret || ''}
                      onChange={(e) => setConfigs({...configs, google_client_secret: e.target.value})}
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-[var(--accent)] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[var(--card2)] border border-[var(--border)] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[var(--info)]">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Información de Seguridad</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                  Estas credenciales se guardan de forma segura en la base de datos y se sincronizan automáticamente con tus archivos 
                  <code className="mx-1 px-1.5 py-0.5 bg-[var(--border)] rounded text-[var(--accent)]">.env</code>. 
                  Asegúrate de no compartir el Client Secret con nadie.
                </p>
              </div>
            </div>
          </div>

          {/* Google Maps API */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-red-500/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <MapPin className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Google Maps</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)]">Geolocalización y Mapas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)]">Habilitar Calibración</span>
                <button 
                  onClick={() => setConfigs({...configs, habilitar_calibracion: configs.habilitar_calibracion === '1' ? '0' : '1'})}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    configs.habilitar_calibracion === '1' ? "bg-green-500" : "bg-gray-300 dark:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    configs.habilitar_calibracion === '1' ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--muted2)] ml-1">API Key</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted2)]" />
                    <input 
                      type="password"
                      value={configs.google_maps_api_key || ''}
                      onChange={(e) => setConfigs({...configs, google_maps_api_key: e.target.value})}
                      placeholder="AIzaSy..."
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:border-[var(--accent)] transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[var(--card2)] border border-[var(--border)] rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-[var(--info)]">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Información</span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
                  Esta clave permite mostrar el mapa de calibración en el carrito. Al activarla, el archivo 
                  <code className="mx-1 px-1.5 py-0.5 bg-[var(--border)] rounded text-[var(--accent)]">.env.local</code> 
                  se actualizará automáticamente con <code className="text-[var(--accent)]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info/Help */}
        <div className="space-y-6">
          <div className="bg-[var(--accent)] p-8 rounded-[32px] text-black shadow-xl shadow-[var(--accent)]/20">
            <h3 className="text-xl font-black tracking-tight mb-4">¿Cómo obtenerlas?</h3>
            <div className="space-y-4">
              {[
                'Ve a Google Cloud Console',
                'Crea un proyecto nuevo',
                'Habilita "OAuth 2.0"',
                'Descarga el archivo JSON',
                'Impórtalo aquí arriba'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-black/10 rounded-full flex items-center justify-center text-[10px] font-black">{i+1}</div>
                  <span className="text-xs font-bold">{step}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
              Ver Guía Completa
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[32px] space-y-4">
            <h4 className="font-black uppercase tracking-widest text-[var(--muted2)] text-[10px]">Estado del Sistema</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Base de Datos</span>
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Escritura en .env</span>
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Cifrado de datos</span>
                <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
