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

export interface MetadataBiolink extends PerfilBiolink {
  enlaces: EnlaceItem[];
  redesSociales: RedesSociales;
}

export interface EnlaceResponse {
  id: string;
  alias: string;
  tipo: 'BIOLINK' | 'SHORT';
  urlOriginal?: string;
  metadata: MetadataBiolink;
  activo: boolean;
  clicks: number;
}
