"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const IMAGE_FORMATS = [
  { id: "JPG", isPro: false },
  { id: "PNG", isPro: false },
  { id: "WEBP", isPro: true },
  { id: "BMP", isPro: true },
  { id: "GIF", isPro: true },
  { id: "TIFF", isPro: true },
];

interface ConversionResult {
  name: string;
  blob: Blob;
}

interface UseImageConverterOptions {
  plan: string | undefined;
}

export function useImageConverter({ plan }: UseImageConverterOptions) {
  const [selectedFormat, setSelectedFormat] = useState("JPG");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult[]>([]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);

  useEffect(() => () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFormatSelect = (formatId: string, isPro: boolean) => {
    if (isPro && plan === "FREE") {
      setModalMessage(`El formato ${formatId} es exclusivo para usuarios Premium.`);
      setIsProModalOpen(true);
      return;
    }
    setSelectedFormat(formatId);
  };

  const processFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    if (selectedFiles.length > 1 && plan === "FREE") {
      setModalMessage("La conversión por lotes es una función Premium. Actualiza para convertir múltiples imágenes a la vez.");
      setIsProModalOpen(true);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    selectedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" supera el límite de 5MB.`);
      } else if (!file.type.startsWith("image/")) {
        errors.push(`"${file.name}" no es un formato de imagen válido.`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(" "));
      toast.error("Algunos archivos fueron ignorados.", { description: errors[0] });
    } else {
      setError(null);
    }

    if (validFiles.length > 0) {
      previews.forEach((url) => URL.revokeObjectURL(url));
      setFiles(validFiles);
      setPreviews(validFiles.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(event.target.files || []));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(event.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setPreviews((current) => current.filter((_, previewIndex) => previewIndex !== index));
  };

  const resetFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviews([]);
    setError(null);
    setProgress(0);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setProgress(0);
    setError(null);
    setConversionResult([]);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 200);

    try {
      const convertedFiles = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", selectedFormat);
        if (watermarkFile && plan === "PRO") formData.append("watermark", watermarkFile);

        const response = await fetch("/api/v1/tools/convert-image", {
          method: "POST",
          headers: { Authorization: `Bearer ${Cookies.get('token') || ""}` },
          body: formData,
        });

        if (!response.ok) throw new Error("Error en la conversión de imagen");
        return { name: file.name, blob: await response.blob() };
      }));

      clearInterval(progressInterval);
      setProgress(100);

      setConversionResult(convertedFiles);
      convertedFiles.forEach(({ name, blob }) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${name.replace(/\.[^/.]+$/, "")}.${selectedFormat.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });

      if (plan === "FREE") {
        setTimeout(() => setIsUpsellModalOpen(true), 1500);
      } else {
        toast.success(`¡${files.length} archivo(s) convertido(s) con éxito!`);
      }
    } catch (conversionError) {
      clearInterval(progressInterval);
      setProgress(0);
      const message = conversionError instanceof Error
        ? conversionError.message
        : "Ocurrió un error en la conversión de algunos archivos.";
      setError(message);
      toast.error(message);
    } finally {
      setTimeout(() => {
        setIsConverting(false);
      }, 500);
    }
  };

  return {
    selectedFormat,
    files,
    previews,
    isConverting,
    progress,
    error,
    conversionResult,
    isProModalOpen,
    isUpsellModalOpen,
    modalMessage,
    isDragging,
    watermarkFile,
    setIsProModalOpen,
    setIsUpsellModalOpen,
    setIsDragging,
    setWatermarkFile,
    handleFormatSelect,
    handleFileChange,
    handleDrop,
    removeFile,
    resetFiles,
    handleSubmit,
  };
}
