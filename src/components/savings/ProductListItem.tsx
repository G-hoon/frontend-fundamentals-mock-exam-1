import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from '@/types/savings';
import { formatNumber } from '@/utils/format';

interface ProductListItemProps {
  product: SavingsProduct;
  isSelected: boolean;
  onSelect: (productId: string) => void;
}

/**
 * 적금 상품 아이템 컴포넌트
 * 상품 정보를 표시하고 선택 기능을 제공합니다.
 */
export function ProductListItem({ product, isSelected, onSelect }: ProductListItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={() => onSelect(product.id)}
    />
  );
}
