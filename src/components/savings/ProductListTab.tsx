import type { SavingsProduct } from '@/types/savings';
import { ProductListItem } from './ProductListItem';

interface ProductListTabProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
}

/**
 * 적금 상품 목록 탭 컴포넌트
 */
export function ProductListTab({ products, selectedProductId, onProductSelect }: ProductListTabProps) {
  return (
    <>
      {products.map(product => (
        <ProductListItem
          key={product.id}
          product={product}
          isSelected={selectedProductId === product.id}
          onSelect={onProductSelect}
        />
      ))}
    </>
  );
}
