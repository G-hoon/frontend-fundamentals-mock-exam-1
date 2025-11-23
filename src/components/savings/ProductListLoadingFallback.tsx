import { Flex, Text, Spacing } from 'tosslib';

/**
 * 상품 목록 로딩 Fallback 컴포넌트
 * 상품 목록 영역만 로딩 표시
 */
export function ProductListLoadingFallback() {
  return (
    <>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ width: '100%', height: '200px', padding: '20px 0px' }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '8px solid #f3f3f3',
            borderTop: '8px solid #333',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <Spacing size={16} />
        <Text>상품 목록을 불러오는 중...</Text>
      </Flex>
    </>
  );
}
