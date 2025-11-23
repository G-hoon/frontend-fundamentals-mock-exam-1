import { useState } from 'react';
import type { TabType } from '@/types/savings';

interface UseSavingsTabReturn {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

/**
 * 탭 상태를 관리하는 Hook
 */
export function useSavingsTab(): UseSavingsTabReturn {
  const [currentTab, setCurrentTab] = useState<TabType>('products');

  return {
    currentTab,
    setCurrentTab,
  };
}
