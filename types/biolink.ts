export interface RedesSociales {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
}

export interface EnlaceItem {
  id: string;
  titulo: string;
  url: string;
  icono?: string;
  activo: boolean;
}

export interface PerfilBiolink {
  titulo: string;
  descripcion: string;
  avatarUrl: string;
  tema: 'DARK' | 'LIGHT';
  colorPrincipal: string;
}

export interface BiolinkFlatData extends PerfilBiolink {
  enlaces: EnlaceItem[];
  redesSociales: RedesSociales;
}

export interface MetadataBiolink {
  perfil: PerfilBiolink;
  enlaces: EnlaceItem[];
  redesSociales: RedesSociales;
}

export interface EnlaceResponse {
  id: string;
  alias: string;
  codigoCorto?: string;
  tipo: 'BIOLINK' | 'SHORT' | 'SIGNATURE' | 'URL' | 'PHONE' | 'WHATSAPP' | 'EMAIL';
  urlOriginal?: string;
  metadata: MetadataBiolink;
  activo: boolean;
  clicks: number;
  fechaCreacion?: string;
}
