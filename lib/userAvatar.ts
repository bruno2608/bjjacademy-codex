type AvatarSource = {
  nome?: string | null
  nomeCompleto?: string | null
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
}

export const buildInitials = (name = '', email = '') => {
  const source = name || email || 'Usuário'
  const parts = source.split(/[\s@._-]+/).filter(Boolean)
  if (parts.length === 0) return 'US'
  const first = parts[0][0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export function getUserAvatarData(entity?: AvatarSource | null) {
  const nome = entity?.nome ?? entity?.nomeCompleto ?? entity?.name ?? 'Usuário'
  const avatarUrl = entity?.avatarUrl ?? null
  const email = entity?.email ?? ''

  const initials = buildInitials(nome, email)

  return { nome, avatarUrl, initials }
}

