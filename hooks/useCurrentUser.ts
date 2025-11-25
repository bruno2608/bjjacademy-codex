import useUserStore from '@/store/userStore';

export function useCurrentUser() {
  const user = useUserStore((s) => s.user);
  return { user };
}
