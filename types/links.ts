export interface LinkMetadata {
  nombreQR?: string;
}

export interface EnlaceResponse {
  id: string;
  alias: string;
  codigoCorto?: string;
  tipo: "SHORT" | "URL" | "PHONE" | "WHATSAPP" | "EMAIL" | "QR" | "STANDARD";
  urlOriginal?: string;
  metadata?: LinkMetadata;
  activo: boolean;
  clicks: number;
  fechaCreacion?: string;
}
