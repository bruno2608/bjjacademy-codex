export interface Academia {
  id: string;
  nome: string;
  codigoConvite: string;
  ativa: boolean;
  cidade?: string;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
  createdAt: string;
  updatedAt?: string;
}
