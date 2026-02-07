import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSystemSettings() {
  const { data, error, mutate } = useSWR('/api/v1/admin/settings', fetcher);

  return {
    currency: data?.currency || 'VND',
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}