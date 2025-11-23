# 토스 적금 계산기 (Toss Savings Calculator)

> React + TypeScript 기반 적금 상품 계산기 프로젝트

## 궁금한것

**tosslib 컴포넌트의 접근성:**

- `SelectBottomSheet`: 모달 동작이지만 키보드 트랩(`tabindex`) 미지원
- `Esc` 키로 모달 닫기 기능 없는데 접근성에 대해 어떻게 고려하는지 궁금 합니다.

**Suspense 와 ErrorBounday**

- 실제 개발 과정에서, 각 컴포넌트 사이의 errorboundary와 suspense 처리를 어떻게 하는지 궁금합니다.
- 저는 해당 과제에서 react-query를 쓰진 않고, wrapPromise 를 사용하여 suspense 를 트리거 했지만, 과제에서는 react-query를 써서 선언형으로 쉽게 처리하는게 더 좋은 방향성이었을지 궁금합니다. (다른 분들은 거의 쓰시길래)

## 프로젝트 개요

사용자가 입력한 목표 금액, 월 납입액, 저축 기간을 기반으로 적금 상품을 비교하고 예상 수익을 계산하는 웹 애플리케이션입니다.

## 주요 기능

### 1. 적금 계산 입력

- 목표 금액 입력 (1000원 단위 자동 포맷팅)
- 월 납입액 입력 (1000원 단위 자동 포맷팅)
- 저축 기간 선택 (6개월, 12개월, 24개월)

### 2. 적금 상품 탭

- 전체 적금 상품 목록 표시
- 상품별 연 이자율, 최소/최대 월 납입액, 저축 기간 정보 제공
- 상품 선택 기능 (토글 방식)

### 3. 계산 결과 탭

- 선택한 상품 기준 예상 수익 계산
  - 예상 수령 금액
  - 목표 금액과의 차이
  - 목표 달성을 위한 추천 월 납입액
- 상위 3개 고금리 상품 추천

## 기술적 특징

### React-Query 없이 Suspense 직접 구현

이 프로젝트는 react-query와 같은 외부 라이브러리 없이 **React Suspense 패턴을 직접 구현**했습니다.

#### Suspense 구현 방식

**`src/utils/suspense.ts`**: Promise 래핑 유틸리티

```typescript
export function wrapPromise<T>(promise: Promise<T>): SuspenseResource<T> {
  let status: ResourceStatus = 'pending';
  let result: T;
  let error: Error;

  const suspender = promise.then(
    response => {
      status = 'success';
      result = response;
    },
    err => {
      status = 'error';
      error = err;
    }
  );

  return {
    read(): T {
      if (status === 'pending') {
        throw suspender; // Suspense를 트리거
      }
      if (status === 'error') {
        throw error; // ErrorBoundary를 트리거
      }
      return result;
    },
  };
}
```

**`src/hooks/useSavingsProducts.ts`**: Suspense 지원 데이터 fetching Hook

```typescript
let resource: SuspenseResource<SavingsProduct[]> | null = null;

export function useSavingsProducts(): SavingsProduct[] {
  if (!resource) {
    resource = wrapPromise(fetchSavingsProducts());
  }
  return resource.read(); // pending 시 Promise throw → Suspense 트리거
}
```

**핵심 원리:**

1. `read()` 호출 시 `status`가 `pending`이면 Promise를 throw
2. React Suspense가 throw된 Promise를 감지하고 fallback UI 표시
3. Promise 완료 후 컴포넌트 재렌더링 시 데이터 반환
4. 에러 발생 시 ErrorBoundary로 에러 전파

#### 아키텍처 구조

```
SavingsProductsDataFetcher (Suspense + ErrorBoundary 래퍼)
  ├─ ErrorBoundary
  │   └─ ProductListErrorFallback (에러 시)
  │
  └─ Suspense
      ├─ ProductListLoadingFallback (로딩 시)
      └─ SavingsProductsContent
          └─ useSavingsProducts() ← Promise throw로 Suspense 트리거
```

### 접근성 (Accessibility) 고려

웹뷰 환경을 목표로 하면서도 기본적인 접근성을 고려하여 구현했습니다.

#### 구현 사항

1. **키보드 내비게이션 지원**
   - 적금 상품 아이템: `Enter`, `Space` 키로 선택 가능
   - `tabIndex={0}` 적용으로 포커스 가능

2. **ARIA 속성 활용**
   - `role="button"`: 클릭 가능한 요소 명시
   - `aria-pressed`: 선택 상태 표시
   - `aria-label`: 스크린 리더를 위한 상세 정보 제공
     ```typescript
     const ariaLabel = `${product.name}, 연 이자율 ${product.annualRate}퍼센트,
       월 ${formatNumber(product.minMonthlyAmount)}원부터
       ${formatNumber(product.maxMonthlyAmount)}원까지,
       ${product.availableTerms}개월,
       ${isSelected ? '선택됨' : '선택 안됨'}`;
     ```
   - 탭 네비게이션에 `aria-label` 적용

3. **시맨틱 HTML**
   - 적절한 HTML 태그 사용으로 구조 명확화

## 프로젝트 구조

### 디렉토리 구조

```
src/
├── components/           # React 컴포넌트
│   ├── common/
│   │   └── ErrorBoundary.tsx
│   └── savings/
│       ├── SavingsInputForm.tsx          # 입력 폼
│       ├── SavingsTabNavigation.tsx      # 탭 네비게이션
│       ├── SavingsProductsDataFetcher.tsx # Suspense 래퍼
│       ├── ProductListTab.tsx            # 상품 목록 탭
│       ├── ProductListItem.tsx           # 상품 아이템
│       ├── CalculationResultTab.tsx      # 계산 결과 탭
│       ├── ResultSummary.tsx             # 결과 요약
│       ├── ProductListLoadingFallback.tsx
│       └── ProductListErrorFallback.tsx
├── hooks/               # Custom Hooks
│   ├── useSavingsForm.ts        # 입력 폼 상태 관리
│   ├── useSavingsTab.ts         # 탭 상태 관리
│   ├── useSavingsProducts.ts    # 상품 데이터 fetching (Suspense)
│   ├── useSavingsCalculation.ts # 계산 로직
│   └── useSavingsTabData.ts     # 탭 데이터 가공
├── pages/               # 페이지 컴포넌트
│   └── SavingsCalculatorPage.tsx
├── types/               # TypeScript 타입 정의
│   └── savings.ts
└── utils/               # 유틸리티 함수
    ├── suspense.ts      # Suspense 구현
    ├── calculate.ts     # 적금 계산 로직
    └── format.ts        # 숫자 포맷팅
```

### 컴포넌트 구조 도식화

```
SavingsCalculatorPage
│
├─ NavigationBar (tosslib)
│
├─ SavingsInputForm
│   ├─ TextField (목표 금액)
│   ├─ TextField (월 납입액)
│   └─ SelectBottomSheet (저축 기간)
│
├─ SavingsTabNavigation
│   └─ Tab (tosslib)
│       ├─ Tab.Item (적금 상품)
│       └─ Tab.Item (계산 결과)
│
└─ SavingsProductsDataFetcher
    │
    ├─ ErrorBoundary
    │   └─ ProductListErrorFallback (에러 시)
    │
    └─ Suspense
        ├─ ProductListLoadingFallback (로딩 시)
        │
        └─ 조건부 렌더링
            │
            ├─ [currentTab === 'products']
            │   └─ ProductListTab
            │       └─ ProductListItem[] (map)
            │           └─ ListRow (tosslib)
            │
            └─ [currentTab === 'results']
                └─ CalculationResultTab
                    ├─ ResultSummary (선택 상품 결과)
                    └─ ProductListTab (추천 상품)
```

### 데이터 흐름

```
useSavingsProducts (Hook)
  ↓
wrapPromise() - Promise 래핑
  ↓
resource.read()
  ├─ [pending] → throw Promise → Suspense 트리거
  ├─ [error] → throw Error → ErrorBoundary 트리거
  └─ [success] → 데이터 반환
       ↓
SavingsProductsContent (render props)
  ↓
useSavingsTabData - 데이터 가공
  ├─ productsTab: { products }
  └─ resultsTab: { selectedProduct, calculationResult, topProducts }
       ↓
ProductListTab / CalculationResultTab
```

## 기술 스택

- **프레임워크**: React 18
- **언어**: TypeScript
- **빌드 도구**: Vite
- **스타일링**: Emotion (CSS-in-JS)
- **라우팅**: React Router v7
- **UI 라이브러리**: tosslib (토스 내부 컴포넌트 라이브러리)

## 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev
```

## 주요 구현 포인트

### 1. 컴포넌트 분리 및 단일 책임 원칙

- 각 컴포넌트가 하나의 역할만 담당하도록 설계
- 재사용 가능한 작은 단위로 분리

### 2. Custom Hook을 통한 로직 분리

- UI 컴포넌트와 비즈니스 로직 분리
- 상태 관리 로직의 재사용성 향상

### 3. 타입 안정성

- TypeScript를 활용한 엄격한 타입 정의
- interface를 통한 명확한 데이터 구조

### 4. 사용자 경험 최적화

- 로딩/에러 상태 처리로 안정적인 UX 제공
- 입력 폼과 탭은 항상 활성화 (Suspense 영역 분리)
- 숫자 입력 시 자동 포맷팅 (1000원 단위 콤마)

### 5. 에러 처리

- ErrorBoundary를 통한 선언적 에러 핸들링
- 재시도 기능 제공

## 개발자

**GitHub**: [@g-hoon](https://github.com/g-hoon)
