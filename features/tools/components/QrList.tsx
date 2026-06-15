"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Check, 
  MoreVertical,
  Trash2,
  QrCode,
  FileSignature,
  Globe,
  X,
  Loader2,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/shared/lib/api';
import { EnlaceResponse } from '@/types/biolink';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { cn } from '@/shared/lib/utils';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// ── Badge de tipo ─────────────────────────────────────────
function TipoBadge({ tipo }: { tipo: string }) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    SIGNATURE: { label: 'Firma',     icon: <FileSignature size={12} />, cls: 'bg-emerald-100 text-emerald-600' },
    STANDARD:  { label: 'Enlace',    icon: <LinkIcon size={12} />,      cls: 'bg-brand-turquoise/10 text-brand-turquoise' },
    QR:        { label: 'Código QR', icon: <QrCode size={12} />,        cls: 'bg-amber-100 text-amber-600' },
  };
  const config = map[tipo] ?? { label: tipo, icon: <LinkIcon size={12} />, cls: 'bg-slate-100 text-slate-600' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider', config.cls)}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ── Menú de acciones por fila ──────────────────────────────
function ActionsDropdown({ link, onDelete, onEdit }: { link: EnlaceResponse; onDelete: (link: EnlaceResponse) => void; onEdit: (link: EnlaceResponse) => void; }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { copy, copied } = useCopyToClipboard();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCopy = () => {
    copy(`${window.location.origin}/${link.alias}`);
    toast.success('¡Enlace copiado al portapapeles!');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        title="Acciones"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            Copiar enlace
          </button>
          <a
            href={`/${link.alias}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={15} />
            Visitar
          </a>
          <button
            onClick={() => { onEdit(link); setOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Edit2 size={15} />
            Editar
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { onDelete(link); setOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

// ── Modal de confirmación de eliminación ───────────────────
function DeleteModal({ link, onConfirm, onCancel, isDeleting }: {
  link: EnlaceResponse;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-red-100 rounded-2xl">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <h3 className="text-xl font-[1000] text-slate-900 mb-2">¿Eliminar enlace?</h3>
        <p className="text-sm font-medium text-slate-500 mb-6">
          El alias <span className="font-black text-slate-800">/{link.alias}</span> será eliminado permanentemente. Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Edición ───────────────────────────────────────
function EditModal({ link, onConfirm, onCancel, isUpdating }: {
  link: EnlaceResponse;
  onConfirm: (data: any) => void;
  onCancel: () => void;
  isUpdating: boolean;
}) {
  const [alias, setAlias] = useState(link.alias || '');
  const [urlOriginal, setUrlOriginal] = useState(link.urlOriginal || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ alias, urlOriginal });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-amber-100 rounded-2xl">
            <LinkIcon size={22} className="text-amber-500" />
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <h3 className="text-xl font-[1000] text-slate-900 mb-2">Editar QR</h3>
        
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
          <strong>Advertencia:</strong> Editar la URL de destino o el alias cambiará inmediatamente a dónde apunta este QR. El código QR físico seguirá siendo el mismo pero al escanearlo redirigirá al nuevo destino.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alias (Personalizado)</label>
            <input 
              type="text" 
              value={alias} 
              onChange={e => setAlias(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 outline-none text-sm font-medium"
              placeholder="mi-enlace"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL de Destino</label>
            <input 
              type="url" 
              required
              value={urlOriginal} 
              onChange={e => setUrlOriginal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 outline-none text-sm font-medium"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────
export function QrList() {
  const [links, setLinks] = useState<EnlaceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<EnlaceResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toEdit, setToEdit] = useState<EnlaceResponse | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { copy } = useCopyToClipboard();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiFetch<EnlaceResponse[]>('/api/management/qrs/list');
        setLinks(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        setLinks([]);
        const error = err as { status?: number; message?: string };
        if (error.status === 401) router.push('/login');
        else toast.error(error.message || 'Error al cargar los enlaces');
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);

    try {
      const token = Cookies.get('token');
      // Usamos fetch nativo exactamente como indicó el Backend para evitar el parseo forzado a JSON
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/management/qrs/${toDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 1. Si la respuesta es exitosa (200 OK o 204 No Content)
      if (response.ok) {
        // ¡CERO parseo de .json() aquí!
        setLinks(prev => prev.filter(l => l.id !== toDelete.id));
        toast.success('Enlace eliminado correctamente');
      } 
      // 2. Manejo de errores específicos (Seguridad)
      else if (response.status === 404) {
        toast.error('El enlace no existe o no te pertenece.');
      } else if (response.status === 403) {
        toast.error('No tienes permisos para eliminar este enlace.');
      } else {
        toast.error('Error al eliminar el enlace en el servidor.');
      }

    } catch (error) {
      console.error("Fallo de red al eliminar:", error);
      toast.error('Ocurrió un error de conexión al eliminar.');
    } finally {
      // Limpiamos los estados del modal
      setIsDeleting(false);
      setToDelete(null);
    }
  };

  const handleEdit = async (data: any) => {
    if (!toEdit) return;
    setIsUpdating(true);
    try {
      const response = await apiFetch<EnlaceResponse>(`/api/management/qrs/${toEdit.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      setLinks(prev => prev.map(l => l.id === response.id ? response : l));
      toast.success('Enlace actualizado correctamente');
      setToEdit(null);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el enlace');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 w-full bg-slate-100/80 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <EmptyState
        icon={LinkIcon}
        title="Sin QRs todavía"
        description="Crea tu primer código QR dinámico desde el panel de herramientas."
        actionLabel="Crear QR"
        onAction={() => router.push('/dashboard')}
      />
    );
  }

  return (
    <>
      {toDelete && (
        <DeleteModal
          link={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          isDeleting={isDeleting}
        />
      )}

      {toEdit && (
        <EditModal
          link={toEdit}
          onConfirm={handleEdit}
          onCancel={() => setToEdit(null)}
          isUpdating={isUpdating}
        />
      )}

      <GlassCard className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Nombre / Destino</th>
                <th className="px-6 py-4 hidden md:table-cell">Tipo</th>
                <th className="px-6 py-4 hidden md:table-cell">Creación</th>
                <th className="px-6 py-4 hidden md:table-cell">Estadísticas</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Nombre / Destino */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-slate-900 truncate block max-w-[120px] md:max-w-none">/{link.alias}</span>
                      {link.urlOriginal && (
                        <span className="text-[11px] font-medium text-slate-400 truncate max-w-[240px]">
                          {link.urlOriginal}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Tipo */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <TipoBadge tipo={link.tipo} />
                  </td>
                  {/* Fecha */}
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap hidden md:table-cell">
                    {link.fechaCreacion
                      ? new Date(link.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Hoy'}
                  </td>
                  {/* Clics */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-sm font-black text-slate-700">{link.clicks ?? 0}</span>
                    <span className="text-[10px] text-slate-400 ml-1">clics</span>
                  </td>
                  {/* Acciones */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => copy(`${window.location.origin}/${link.codigoCorto || link.alias}`)}
                        className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-400 hover:text-brand-turquoise hover:bg-slate-50 rounded-lg transition-colors"
                        title="Copiar enlace"
                      >
                        <Copy size={16} />
                        <span className="hidden md:inline-block text-xs font-bold">Copiar</span>
                      </button>
                      <button
                        onClick={() => setToDelete(link)}
                        className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar enlace"
                      >
                        <Trash2 size={16} />
                        <span className="hidden md:inline-block text-xs font-bold">Eliminar</span>
                      </button>
                      <ActionsDropdown link={link} onDelete={setToDelete} onEdit={setToEdit} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </>
  );
}
