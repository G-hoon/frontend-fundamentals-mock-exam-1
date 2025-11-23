import { useEffect, useState } from 'react';
import {
  Assets,
  Border,
  colors,
  http,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import type { SavingsProduct, TabType } from '@/types/savings';
import { formatNumber, parseNumber, formatCurrency, handleAmountChange } from '@/utils/format';
import {
  filterProducts,
  calculateExpectedAmount,
  calculateDifference,
  calculateRecommendedMonthly,
  getTopRateProducts,
} from '@/utils/calculate';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [savingsPeriod, setSavingsPeriod] = useState<number>(12);
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('products');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 연동 - 적금 상품 목록 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setProducts(response);
      } catch (e) {
        setError('상품 목록을 불러오는데 실패했습니다.');
        console.error('Failed to fetch products:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 입력값에 따라 필터링된 상품 목록
  const filteredProducts =
    parseNumber(monthlyAmount) > 0 ? filterProducts(products, parseNumber(monthlyAmount), savingsPeriod) : products;

  // 상품 선택 핸들러
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId === selectedProductId ? null : productId);
  };

  if (isLoading) {
    return (
      <>
        <NavigationBar title="적금 계산기" />
        <Spacing size={16} />
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />} />
      </>
    );
  }

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

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={e => handleAmountChange(e.target.value, setTargetAmount)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={e => handleAmountChange(e.target.value, setMonthlyAmount)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={value => setSavingsPeriod(value as number)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setCurrentTab(value as TabType)}>
        <Tab.Item value="products" selected={currentTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 탭 */}
      {currentTab === 'products' &&
        filteredProducts.map(product => (
          <ListRow
            key={product.id}
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
            right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
            onClick={() => handleProductSelect(product.id)}
          />
        ))}

      {/* 계산 결과 탭 */}
      {currentTab === 'results' &&
        (() => {
          const selectedProduct = products.find(p => p.id === selectedProductId);

          // 상품을 선택하지 않은 경우
          if (!selectedProduct) {
            return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
          }

          // 계산 로직
          const monthly = parseNumber(monthlyAmount);
          const target = parseNumber(targetAmount);
          const expectedAmount = calculateExpectedAmount(monthly, savingsPeriod, selectedProduct.annualRate);
          const difference = calculateDifference(target, expectedAmount);
          const recommendedMonthly = calculateRecommendedMonthly(target, savingsPeriod, selectedProduct.annualRate);

          // 추천 상품 목록 (필터링된 상품 중 이자율 상위 2개)
          const topProducts = getTopRateProducts(filteredProducts, 2);

          return (
            <>
              <Spacing size={8} />

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

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {topProducts.map(product => (
                <ListRow
                  key={product.id}
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
                  right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                  onClick={() => handleProductSelect(product.id)}
                />
              ))}

              <Spacing size={40} />
            </>
          );
        })()}
    </>
  );
}
