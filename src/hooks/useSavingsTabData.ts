import { useMemo } from 'react';
import type { SavingsProduct } from '@/types/savings';
import { parseNumber } from '@/utils/format';
import {
  filterProducts,
  calculateExpectedAmount,
  calculateDifference,
  calculateRecommendedMonthly,
  getTopRateProducts,
} from '@/utils/calculate';

interface UseSavingsTabDataParams {
  products: SavingsProduct[];
  targetAmount: string;
  monthlyAmount: string;
  savingsPeriod: number;
  selectedProductId: string | null;
}

/**
 * 적금 탭에 필요한 데이터를 계산하는 Hook
 */
export function useSavingsTabData({
  products,
  targetAmount,
  monthlyAmount,
  savingsPeriod,
  selectedProductId,
}: UseSavingsTabDataParams) {
  // 필터링된 상품 목록
  const filteredProducts = useMemo(
    () =>
      parseNumber(monthlyAmount) > 0
        ? filterProducts(products, parseNumber(monthlyAmount), savingsPeriod)
        : products,
    [products, monthlyAmount, savingsPeriod]
  );

  // 선택된 상품
  const selectedProduct = useMemo(
    () => products.find(p => p.id === selectedProductId),
    [products, selectedProductId]
  );

  // 계산 결과
  const calculationResult = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }

    const expectedAmount = calculateExpectedAmount(
      parseNumber(monthlyAmount),
      savingsPeriod,
      selectedProduct.annualRate
    );

    return {
      expectedAmount,
      difference: calculateDifference(parseNumber(targetAmount), expectedAmount),
      recommendedMonthly: calculateRecommendedMonthly(
        parseNumber(targetAmount),
        savingsPeriod,
        selectedProduct.annualRate
      ),
    };
  }, [selectedProduct, targetAmount, monthlyAmount, savingsPeriod]);

  // 추천 상품 목록 (이자율 상위 2개)
  const topProducts = useMemo(
    () => getTopRateProducts(filteredProducts, 2),
    [filteredProducts]
  );

  return {
    productsTab: {
      products: filteredProducts,
    },
    resultsTab: {
      selectedProduct,
      calculationResult,
      topProducts,
    },
  };
}
