import type { SavingsProduct } from '@/types/savings';

/**
 * 적금 상품 필터링
 * 월 납입액과 저축 기간 조건에 맞는 상품만 반환
 *
 * @param products - 전체 상품 목록
 * @param monthlyAmount - 월 납입액
 * @param savingsPeriod - 저축 기간
 * @returns 필터링된 상품 목록
 */
export function filterProducts(
  products: SavingsProduct[],
  monthlyAmount: number,
  savingsPeriod: number
): SavingsProduct[] {
  return products.filter(
    product =>
      monthlyAmount >= product.minMonthlyAmount &&
      monthlyAmount <= product.maxMonthlyAmount &&
      product.availableTerms === savingsPeriod
  );
}
