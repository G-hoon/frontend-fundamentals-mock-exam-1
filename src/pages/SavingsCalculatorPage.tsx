import { ListRow, NavigationBar, Spacing } from 'tosslib';
import { useSavingsProducts } from '@/hooks/useSavingsProducts';
import { useSavingsForm } from '@/hooks/useSavingsForm';
import { useSavingsCalculation } from '@/hooks/useSavingsCalculation';
import { useSavingsTab } from '@/hooks/useSavingsTab';
import { SavingsInputForm } from '@/components/savings/SavingsInputForm';
import { SavingsTabNavigation } from '@/components/savings/SavingsTabNavigation';
import { ProductListTab } from '@/components/savings/ProductListTab';
import { CalculationResultTab } from '@/components/savings/CalculationResultTab';

/**
 * 적금 계산기 메인 페이지
 * Custom Hook을 통해 상태와 로직을 관리하고,
 * Presentational Component로 UI를 렌더링합니다.
 */
export function SavingsCalculatorPage() {
  // 상품 데이터 로딩
  const { products, isLoading, error } = useSavingsProducts();

  // 입력 폼 상태
  const {
    targetAmount,
    monthlyAmount,
    savingsPeriod,
    setSavingsPeriod,
    handleTargetAmountChange,
    handleMonthlyAmountChange,
  } = useSavingsForm();

  // 계산 로직
  const { selectedProductId, selectedProduct, filteredProducts, calculationResult, topProducts, handleProductSelect } =
    useSavingsCalculation({
      products,
      targetAmount,
      monthlyAmount,
      savingsPeriod,
    });

  // 탭 상태
  const { currentTab, setCurrentTab } = useSavingsTab();

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <NavigationBar title="적금 계산기" />
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />} />
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <>
        <NavigationBar title="적금 계산기" />
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top={error} />} />
      </>
    );
  }

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* 입력 폼 */}
      <SavingsInputForm
        targetAmount={targetAmount}
        monthlyAmount={monthlyAmount}
        savingsPeriod={savingsPeriod}
        onTargetAmountChange={handleTargetAmountChange}
        onMonthlyAmountChange={handleMonthlyAmountChange}
        onSavingsPeriodChange={setSavingsPeriod}
      />

      {/* 탭 네비게이션 */}
      <SavingsTabNavigation currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* 적금 상품 탭 */}
      {currentTab === 'products' && (
        <ProductListTab
          products={filteredProducts}
          selectedProductId={selectedProductId}
          onProductSelect={handleProductSelect}
        />
      )}

      {/* 계산 결과 탭 */}
      {currentTab === 'results' && (
        <CalculationResultTab
          selectedProduct={selectedProduct}
          calculationResult={calculationResult}
          topProducts={topProducts}
          selectedProductId={selectedProductId}
          onProductSelect={handleProductSelect}
        />
      )}
    </>
  );
}
