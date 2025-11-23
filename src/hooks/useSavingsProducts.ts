import { useEffect, useState } from 'react';
import { http } from 'tosslib';
import type { SavingsProduct } from '@/types/savings';

interface UseSavingsProductsReturn {
  products: SavingsProduct[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 적금 상품 데이터를 불러오는 Hook
 * API 호출, 로딩 상태, 에러 상태를 관리합니다.
 */
export function useSavingsProducts(): UseSavingsProductsReturn {
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setProducts(response);
      } catch (e) {
        setError('상품 목록을 불러오는데 실패했습니다.');
        console.error('Failed to fetch products:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
