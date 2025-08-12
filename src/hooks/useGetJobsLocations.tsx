'use client'
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export function useGetJobsLocations() {
  const { data: session, status } = useSession();
  const accessToken = session?.user?.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetcher = (url: string) => fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  }).then((res) => res.json());

  const endpoint = accessToken
    ? `${apiUrl}/api/v1/job/list-job-locations`
    : null;

  const { data, error, isLoading } = useSWR(endpoint, fetcher);

  return {
    locations: data?.data,
    error,
    isLoading,
    sessionStatus: status
  }
}
