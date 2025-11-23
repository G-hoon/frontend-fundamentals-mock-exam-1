import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useSavingsProducts } from '@/hooks/useSavingsProducts';
import { ProductListLoadingFallback } from './ProductListLoadingFallback';
import { ProductListErrorFallback } from './ProductListErrorFallback';
import type { SavingsProduct } from '@/types/savings';

interface SavingsProductsDataFetcherProps {
  children: (products: SavingsProduct[]) => ReactNode;
}

/**
 * 상품 데이터를 불러오는 내부 컴포넌트
 * useSavingsProducts()를 호출하여 Suspense를 트리거하고,
 * render props로 데이터를 전달합니다.
 */
function SavingsProductsContent({ children }: SavingsProductsDataFetcherProps) {
  const products = useSavingsProducts();
  return <>{children(products)}</>;
}

/**
 * Suspense와 ErrorBoundary로 래핑된 상품 데이터 fetcher
 * render props 패턴으로 자식 컴포넌트에 데이터를 전달합니다.
 */
export function SavingsProductsDataFetcher({ children }: SavingsProductsDataFetcherProps) {
  return (
    <ErrorBoundary fallback={(error, reset) => <ProductListErrorFallback error={error} reset={reset} />}>
      <Suspense fallback={<ProductListLoadingFallback />}>
        <SavingsProductsContent>{children}</SavingsProductsContent>
      </Suspense>
    </ErrorBoundary>
  );
}
