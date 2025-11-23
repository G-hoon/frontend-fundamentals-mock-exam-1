import { Border, ListHeader, ListRow, Spacing } from 'tosslib';
import type { SavingsProduct } from '@/types/savings';
import { ResultSummary } from './ResultSummary';
import { ProductListItem } from './ProductListItem';

interface CalculationResultTabProps {
  selectedProduct: SavingsProduct | undefined;
  calculationResult: {
    expectedAmount: number;
    difference: number;
    recommendedMonthly: number;
  } | null;
  topProducts: SavingsProduct[];
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
}

/**
 * 계산 결과 탭 컴포넌트
 * 선택된 상품이 없으면 안내 메시지를 표시하고,
 * 있으면 계산 결과와 추천 상품 목록을 표시합니다.
 */
export function CalculationResultTab({
  selectedProduct,
  calculationResult,
  topProducts,
  selectedProductId,
  onProductSelect,
}: CalculationResultTabProps) {
  // 상품을 선택하지 않은 경우
  if (!selectedProduct || !calculationResult) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />

      <ResultSummary
        expectedAmount={calculationResult.expectedAmount}
        difference={calculationResult.difference}
        recommendedMonthly={calculationResult.recommendedMonthly}
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {topProducts.map(product => (
        <ProductListItem
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onSelect={onProductSelect}
        />
      ))}

      <Spacing size={40} />
    </>
  );
}
