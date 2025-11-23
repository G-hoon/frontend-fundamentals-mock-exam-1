import { colors, ListRow } from 'tosslib';
import { formatCurrency } from '@/utils/format';

interface ResultSummaryProps {
  expectedAmount: number;
  difference: number;
  recommendedMonthly: number;
}

/**
 * 계산 결과 요약 컴포넌트
 * 예상 수익 금액, 목표 금액과의 차이, 추천 월 납입 금액을 표시합니다.
 */
export function ResultSummary({ expectedAmount, difference, recommendedMonthly }: ResultSummaryProps) {
  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(Math.round(expectedAmount))}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${difference >= 0 ? '' : '-'}${formatCurrency(Math.abs(Math.round(difference)))}`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(recommendedMonthly)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
