import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { ValidatorNode } from '@/types/validators';

async function fetchValidatorAudit(): Promise<ValidatorNode[]> {
  const res = await fetch('/api/validators/audit', {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch validator audit data: ${res.status}`);
  }

  return res.json();
}

/**
 * Loads the validator slashing / heartbeat audit roster from the network.
 * Consumers should render {@link ValidatorMetricsSkeleton} and
 * {@link ValidatorListSkeleton} while `isLoading` is true.
 */
export function useValidatorAudit(): UseQueryResult<ValidatorNode[], Error> {
  return useQuery<ValidatorNode[], Error>({
    queryKey: ['validators', 'audit'],
    queryFn: fetchValidatorAudit,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
}
