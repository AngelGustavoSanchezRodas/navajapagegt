import { useState, FormEvent, useEffect } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/shared/lib/api";
import { useAuth } from "@/shared/contexts/AuthContext";

export interface ShortenResponse {
  alias: string;
  urlOriginal: string;
  codigoCorto?: string;
}

export interface RecentLink {
  id: string;
  originalUrl: string;
  shortUrl?: string;
  alias?: string;
  status: "processing" | "success" | "error";
  createdAt: Date;
}

export function useUrlShortener() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  
  const { plan } = useAuth();

  // Load recent links from localStorage on mount
  useEffect(() => {
    try {
      const storedLinks = localStorage.getItem("recentShortenedLinks");
      if (storedLinks) {
        // Parse and ensure dates are objects
        const parsed = JSON.parse(storedLinks).map((link: any) => ({
          ...link,
          createdAt: new Date(link.createdAt)
        }));
        setRecentLinks(parsed);
      }
    } catch (err) {
      console.error("Failed to load recent links", err);
    }
  }, []);

  // Save to localStorage when recentLinks changes
  useEffect(() => {
    try {
      localStorage.setItem("recentShortenedLinks", JSON.stringify(recentLinks));
    } catch (err) {
      console.error("Failed to save recent links", err);
    }
  }, [recentLinks]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setShortUrl(null);

    const tempId = Date.now().toString();
    const newRecentLink: RecentLink = {
      id: tempId,
      originalUrl: url,
      alias: alias || undefined,
      status: "processing",
      createdAt: new Date(),
    };

    // Optimistic update
    setRecentLinks(prev => [newRecentLink, ...prev].slice(0, 10)); // Keep only last 10

    try {
      const response = await apiFetch<ShortenResponse>('/api/core/links/create', {
        method: 'POST',
        body: JSON.stringify({ 
          urlOriginal: url, 
          tipo: 'STANDARD',
          alias: alias || null
        })
      });
      
      const codigo = response.codigoCorto || response.alias;
      const finalShortUrl = `${window.location.origin}/${codigo}`;
      setShortUrl(finalShortUrl);
      
      // Update recent link status
      setRecentLinks(prev => prev.map(link => 
        link.id === tempId ? { ...link, status: "success", shortUrl: finalShortUrl } : link
      ));
      
      toast.success("¡Enlace acortado con éxito!");
    } catch (err: unknown) {
      const apiError = err as { status?: number; message?: string };
      
      // Mark optimistic update as error
      setRecentLinks(prev => prev.map(link => 
        link.id === tempId ? { ...link, status: "error" } : link
      ));

      if (apiError.status === 402 || apiError.status === 403) {
        setModalMessage(apiError.message || "Tu plan actual no permite realizar esta acción");
        setIsModalOpen(true);
      } else if (apiError.status === 400) {
        setError(apiError.message || "Datos incorrectos");
        toast.error(apiError.message || "Datos incorrectos al acortar el enlace");
      } else if (apiError.status === 409 || apiError.message?.includes('ALIAS_EN_USO')) {
        setError("El alias ya está en uso o es inválido");
      } else {
        setError(apiError.message || "Ocurrió un error inesperado");
        toast.error(apiError.message || "Error al acortar el enlace");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setAlias("");
    setShortUrl(null);
    setError(null);
  };

  const removeRecentLink = (id: string) => {
    setRecentLinks(prev => prev.filter(link => link.id !== id));
  };

  return {
    url,
    setUrl,
    alias,
    setAlias,
    loading,
    error,
    setError,
    shortUrl,
    setShortUrl,
    recentLinks,
    removeRecentLink,
    isModalOpen,
    setIsModalOpen,
    modalMessage,
    setModalMessage,
    plan,
    handleSubmit,
    handleReset
  };
}
