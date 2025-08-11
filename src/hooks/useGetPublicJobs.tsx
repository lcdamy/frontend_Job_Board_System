'use client'
import useSWR from 'swr';

export function useGetPublicJobs(page: number, pageSize: number) {
 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const endpoint = `${apiUrl}/api/v1/job/list?page=${page}&limit=${pageSize}`;

  const { data, error, isLoading } = useSWR(endpoint, fetcher);

  return {
    jobs: data?.data ?? { data: [], total: 0, page: 1, lastPage: 1 },
    total: data?.data?.total ?? 0,
    error,
    isLoading
  }
}