import type { UsuarioPapel } from '@/types';

export const MOCK_USUARIOS_PAPEIS: UsuarioPapel[] = [
  {
    id: 'user_prof_vilmar_role_professor',
    usuarioId: 'user_prof_vilmar',
    papelId: 3,
    dataConcessao: '2022-01-10T12:00:00Z',
    concedidoPor: 'user_admin_ti'
  },
  {
    id: 'user_prof_vilmar_role_aluno',
    usuarioId: 'user_prof_vilmar',
    papelId: 1,
    dataConcessao: '2022-01-10T12:00:00Z',
    concedidoPor: 'user_admin_ti'
  },
  {
    id: 'user_instrutora_ana_role_instrutor',
    usuarioId: 'user_instrutora_ana',
    papelId: 2,
    dataConcessao: '2022-06-05T10:00:00Z',
    concedidoPor: 'user_prof_vilmar'
  },
  {
    id: 'user_instrutora_ana_role_aluno',
    usuarioId: 'user_instrutora_ana',
    papelId: 1,
    dataConcessao: '2020-01-15T08:00:00Z',
    concedidoPor: 'user_prof_vilmar'
  },
  {
    id: 'user_maria_souza_role_aluno',
    usuarioId: 'user_maria_souza',
    papelId: 1,
    dataConcessao: '2019-05-01T09:00:00Z',
    concedidoPor: 'user_instrutora_ana'
  },
  {
    id: 'user_pedro_lima_role_aluno',
    usuarioId: 'user_pedro_lima',
    papelId: 1,
    dataConcessao: '2023-02-10T09:00:00Z',
    concedidoPor: 'user_instrutora_ana'
  }
];
