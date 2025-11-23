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
