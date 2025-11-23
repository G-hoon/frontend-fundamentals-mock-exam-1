import { Button, colors, Flex, Text } from 'tosslib';
import { resetSavingsProducts } from '@/hooks/useSavingsProducts';

interface ProductListErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * 상품 목록 에러 Fallback 컴포넌트
 * 상품 목록 영역만 에러 표시
 */
export function ProductListErrorFallback({ error, reset }: ProductListErrorFallbackProps) {
  const handleRetry = () => {
    resetSavingsProducts();
    reset();
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={16}
      style={{ height: '200px', maxWidth: '400px', margin: '0 auto', padding: '20px 10px' }}
    >
      <Text fontSize={18} fontWeight="bold" color={colors.grey700}>
        상품 목록을 불러오는데 실패했습니다.
      </Text>
      <Text color={colors.red500}>{error.message}</Text>
      <Button onClick={handleRetry} theme="primary" size="small" fullWidth>
        다시 시도
      </Button>
    </Flex>
  );
}
