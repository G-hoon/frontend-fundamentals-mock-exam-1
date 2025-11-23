import { useMemo, useState } from 'react';
import type { SavingsProduct } from '@/types/savings';
import { parseNumber } from '@/utils/format';
import {
  filterProducts,
  calculateExpectedAmount,
  calculateDifference,
  calculateRecommendedMonthly,
  getTopRateProducts,
} from '@/utils/calculate';

interface UseSavingsCalculationParams {
  products: SavingsProduct[];
  targetAmount: string;
  monthlyAmount: string;
  savingsPeriod: number;
}

interface CalculationResult {
  expectedAmount: number;
  difference: number;
  recommendedMonthly: number;
}

interface UseSavingsCalculationReturn {
  selectedProductId: string | null;
  selectedProduct: SavingsProduct | undefined;
  filteredProducts: SavingsProduct[];
  calculationResult: CalculationResult | null;
  topProducts: SavingsProduct[];
  handleProductSelect: (productId: string) => void;
}

/**
 * 적금 계산 로직을 관리하는 Hook
 * 상품 필터링, 선택, 계산 결과를 제공합니다.
 */
export function useSavingsCalculation({
  products,
  targetAmount,
  monthlyAmount,
  savingsPeriod,
}: UseSavingsCalculationParams): UseSavingsCalculationReturn {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // 상품 선택 핸들러
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(prev => (prev === productId ? null : productId));
  };

  // 선택된 상품
  const selectedProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

  // 필터링된 상품 목록
  const filteredProducts = useMemo(() => {
    const monthly = parseNumber(monthlyAmount);
    return monthly > 0 ? filterProducts(products, monthly, savingsPeriod) : products;
  }, [products, monthlyAmount, savingsPeriod]);

  // 계산 결과
  const calculationResult = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }

    const monthly = parseNumber(monthlyAmount);
    const target = parseNumber(targetAmount);
    const expectedAmount = calculateExpectedAmount(monthly, savingsPeriod, selectedProduct.annualRate);
    const difference = calculateDifference(target, expectedAmount);
    const recommendedMonthly = calculateRecommendedMonthly(target, savingsPeriod, selectedProduct.annualRate);

    return {
      expectedAmount,
      difference,
      recommendedMonthly,
    };
  }, [selectedProduct, monthlyAmount, targetAmount, savingsPeriod]);

  // 추천 상품 목록 (이자율 상위 2개)
  const topProducts = useMemo(() => getTopRateProducts(filteredProducts, 2), [filteredProducts]);

  return {
    selectedProductId,
    selectedProduct,
    filteredProducts,
    calculationResult,
    topProducts,
    handleProductSelect,
  };
}
