import { Border, Spacing, Tab } from 'tosslib';
import type { TabType } from '@/types/savings';

interface SavingsTabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

/**
 * 적금 계산기 탭 네비게이션 컴포넌트
 */
export function SavingsTabNavigation({ currentTab, onTabChange }: SavingsTabNavigationProps) {
  return (
    <>
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => onTabChange(value as TabType)}>
        <Tab.Item value="products" selected={currentTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
    </>
  );
}
