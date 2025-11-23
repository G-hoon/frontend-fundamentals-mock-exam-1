import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

interface SavingsInputFormProps {
  targetAmount: string;
  monthlyAmount: string;
  savingsPeriod: number;
  onTargetAmountChange: (value: string) => void;
  onMonthlyAmountChange: (value: string) => void;
  onSavingsPeriodChange: (value: number) => void;
}

/**
 * 적금 계산기 입력 폼 컴포넌트
 * 목표 금액, 월 납입액, 저축 기간을 입력받습니다.
 */
export function SavingsInputForm({
  targetAmount,
  monthlyAmount,
  savingsPeriod,
  onTargetAmountChange,
  onMonthlyAmountChange,
  onSavingsPeriodChange,
}: SavingsInputFormProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={e => onTargetAmountChange(e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={e => onMonthlyAmountChange(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={value => onSavingsPeriodChange(value as number)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
