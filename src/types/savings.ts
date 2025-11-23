/**
 * 적금 상품 타입 정의
 */
export interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number; // 연 이자율 (%)
  minMonthlyAmount: number; // 최소 월 납입액
  maxMonthlyAmount: number; // 최대 월 납입액
  availableTerms: number; // 저축 기간 (개월)
}

/**
 * 사용자 입력 데이터 타입
 */
export interface SavingsInput {
  targetAmount: string; // 목표 금액
  monthlyAmount: string; // 월 납입액
  savingsPeriod: number; // 저축 기간 (6, 12, 24)
}

/**
 * 계산 결과 타입
 */
export interface CalculationResult {
  expectedAmount: number; // 예상 수익 금액
  difference: number; // 목표 금액과의 차이
  recommendedMonthly: number; // 추천 월 납입 금액
}

/**
 * 탭 타입
 */
export type TabType = 'products' | 'results';
