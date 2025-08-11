'use client'
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export function useGetUsers(page: number, pageSize: number) {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetcher = (url: string) => fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  }).then((res) => res.json());

  const endpoint = accessToken
    ? `${apiUrl}/api/v1/auth/users?page=${page}&limit=${pageSize}`
    : null;

  const { data, error, isLoading } = useSWR(endpoint, fetcher);

  return {
    users: data?.data ?? { data: [], total: 0, page: 1, lastPage: 1 },
    total: data?.data?.total ?? 0,
    error,
    isLoading,
    sessionStatus: status
  }
}