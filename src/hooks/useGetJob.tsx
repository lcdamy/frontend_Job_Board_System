'use client'
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export function useGetJob(jobId: string) {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetcher = (url: string) => fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  }).then((res) => res.json());

  const endpoint = accessToken
    ? `${apiUrl}/api/v1/job/detail/${jobId}`
    : null;

  const { data, error, isLoading } = useSWR(endpoint, fetcher);

  return {
    job: data?.data ?? null,
    error,
    isLoading,
    sessionStatus: status
  }
}
