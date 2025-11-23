import { useState } from 'react';
import { NavigationBar, Spacing } from 'tosslib';
import { useSavingsForm, useSavingsTab, useSavingsTabData } from '@/hooks';
import { SavingsInputForm, SavingsTabNavigation, ProductListTab, CalculationResultTab } from '@/components';
import { SavingsProductsDataFetcher } from '@/components/savings/SavingsProductsDataFetcher';

/**
 * 적금 계산기 메인 페이지
 * 탭 영역만 Suspense/ErrorBoundary로 감싸져 있어
 * 상품 목록/계산 결과 로딩/에러 시에도 입력 폼과 탭은 정상 표시됩니다.
 */
export function SavingsCalculatorPage() {
  // 입력 폼 상태
  const {
    targetAmount,
    monthlyAmount,
    savingsPeriod,
    setSavingsPeriod,
    handleTargetAmountChange,
    handleMonthlyAmountChange,
  } = useSavingsForm();

  // 탭 상태
  const { currentTab, setCurrentTab } = useSavingsTab();

  // 선택된 상품 ID (양쪽 탭에서 공유)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(prev => (prev === productId ? null : productId));
  };

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

      {/* 탭 영역 - Suspense/ErrorBoundary로 래핑됨 */}
      <SavingsProductsDataFetcher>
        {(products) => {
          const tabData = useSavingsTabData({
            products,
            targetAmount,
            monthlyAmount,
            savingsPeriod,
            selectedProductId,
          });

          return (
            <>
              {currentTab === 'products' && (
                <ProductListTab
                  products={tabData.productsTab.products}
                  selectedProductId={selectedProductId}
                  onProductSelect={handleProductSelect}
                />
              )}

              {currentTab === 'results' && (
                <CalculationResultTab
                  selectedProduct={tabData.resultsTab.selectedProduct}
                  calculationResult={tabData.resultsTab.calculationResult}
                  topProducts={tabData.resultsTab.topProducts}
                  selectedProductId={selectedProductId}
                  onProductSelect={handleProductSelect}
                />
              )}
            </>
          );
        }}
      </SavingsProductsDataFetcher>
    </>
  );
}
