import { useState } from 'react';
import { handleAmountChange } from '@/utils/format';

interface UseSavingsFormReturn {
  targetAmount: string;
  monthlyAmount: string;
  savingsPeriod: number;
  setTargetAmount: (value: string) => void;
  setMonthlyAmount: (value: string) => void;
  setSavingsPeriod: (value: number) => void;
  handleTargetAmountChange: (value: string) => void;
  handleMonthlyAmountChange: (value: string) => void;
}

/**
 * 적금 계산기 입력 폼 상태를 관리하는 Hook
 * 목표 금액, 월 납입액, 저축 기간 상태와 핸들러를 제공합니다.
 */
export function useSavingsForm(): UseSavingsFormReturn {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [savingsPeriod, setSavingsPeriod] = useState<number>(12);

  const handleTargetAmountChange = (value: string) => {
    handleAmountChange(value, setTargetAmount);
  };

  const handleMonthlyAmountChange = (value: string) => {
    handleAmountChange(value, setMonthlyAmount);
  };

  return {
    targetAmount,
    monthlyAmount,
    savingsPeriod,
    setTargetAmount,
    setMonthlyAmount,
    setSavingsPeriod,
    handleTargetAmountChange,
    handleMonthlyAmountChange,
  };
}
