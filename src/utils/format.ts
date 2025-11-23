/**
 * 숫자를 천 단위 콤마가 포함된 문자열로 변환
 * @param value - 변환할 숫자
 * @returns 콤마가 포함된 문자열 (예: "1,000,000")
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

/**
 * 문자열에서 숫자만 추출하여 숫자로 변환
 * @param value - 변환할 문자열 (콤마 등 특수문자 포함 가능)
 * @returns 숫자 (변환 실패 시 0)
 */
export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * 숫자를 "원" 단위 문자열로 변환
 * @param value - 변환할 숫자
 * @returns 콤마와 "원"이 포함된 문자열 (예: "1,000,000원")
 */
export function formatCurrency(value: number): string {
  return `${formatNumber(value)}원`;
}

/**
 * 지정된 단위로 반올림
 * @param value - 반올림할 숫자
 * @param unit - 반올림 단위 (기본값: 1000)
 * @returns 반올림된 숫자
 */
export function roundToUnit(value: number, unit: number = 1000): number {
  return Math.round(value / unit) * unit;
}

/**
 * 금액 입력 핸들러 (콤마 포맷팅)
 * @param value - 입력값
 * @param setter - 값 설정 함수
 * @returns 콤마가 포함된 문자열
 */
export function handleAmountChange(value: string, setter: (value: string) => void): void {
  const numericValue = parseNumber(value);
  const formattedValue = numericValue > 0 ? formatNumber(numericValue) : '';
  setter(formattedValue);
}
