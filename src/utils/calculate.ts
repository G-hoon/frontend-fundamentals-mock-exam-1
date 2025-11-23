import type { SavingsProduct } from '@/types/savings';
import { roundToUnit } from './format';

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

/**
 * 예상 수익 금액 계산
 * 공식: 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
 *
 * @param monthlyAmount - 월 납입액
 * @param period - 저축 기간 (개월)
 * @param annualRate - 연 이자율 (%)
 * @returns 예상 수익 금액
 */
export function calculateExpectedAmount(monthlyAmount: number, period: number, annualRate: number): number {
  return monthlyAmount * period * (1 + (annualRate / 100) * 0.5);
}

/**
 * 목표 금액과의 차이 계산
 * 공식: 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
 *
 * @param targetAmount - 목표 금액
 * @param expectedAmount - 예상 수익 금액
 * @returns 목표 금액과의 차이
 */
export function calculateDifference(targetAmount: number, expectedAmount: number): number {
  return targetAmount - expectedAmount;
}

/**
 * 추천 월 납입 금액 계산
 * 공식: 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
 * 1,000원 단위로 반올림
 *
 * @param targetAmount - 목표 금액
 * @param period - 저축 기간 (개월)
 * @param annualRate - 연 이자율 (%)
 * @returns 추천 월 납입 금액 (1,000원 단위 반올림)
 */
export function calculateRecommendedMonthly(targetAmount: number, period: number, annualRate: number): number {
  const monthlyAmount = targetAmount / (period * (1 + (annualRate / 100) * 0.5));
  return roundToUnit(monthlyAmount, 1000);
}

/**
 * 연 이자율 기준으로 상품 정렬 및 상위 N개 선택
 *
 * @param products - 상품 목록
 * @param count - 선택할 상품 개수 (기본값: 2)
 * @returns 연 이자율이 높은 순으로 정렬된 상위 N개 상품
 */
export function getTopRateProducts(products: SavingsProduct[], count: number = 2): SavingsProduct[] {
  return [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
}
