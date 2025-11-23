import { http } from 'tosslib';
import type { SavingsProduct } from '@/types/savings';
import { wrapPromise, type SuspenseResource } from '@/utils/suspense';

// 모듈 레벨에서 리소스 저장 (컴포넌트가 다시 렌더링되어도 유지)
let resource: SuspenseResource<SavingsProduct[]> | null = null;

/**
 * 적금 상품 데이터를 불러오는 함수
 */
function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  return http.get<SavingsProduct[]>('/api/savings-products');
}

/**
 * 적금 상품 데이터를 불러오는 Hook (Suspense 지원)
 * Promise를 throw하여 Suspense를 트리거하고,
 * 에러 발생 시 ErrorBoundary가 캐치합니다.
 */
export function useSavingsProducts(): SavingsProduct[] {
  if (!resource) {
    resource = wrapPromise(fetchSavingsProducts());
  }
  return resource.read();
}

/**
 * 리소스를 초기화하는 함수
 * ErrorBoundary에서 재시도 시 사용됩니다.
 */
export function resetSavingsProducts(): void {
  resource = null;
}
