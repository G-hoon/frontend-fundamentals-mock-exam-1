/**
 * Suspense 리소스 상태
 */
type ResourceStatus = 'pending' | 'success' | 'error';

/**
 * Suspense 리소스
 * Promise를 throw하여 Suspense를 트리거합니다.
 */
export interface SuspenseResource<T> {
  read(): T;
}

/**
 * Promise를 Suspense 리소스로 변환
 * React Suspense 패턴을 구현합니다.
 *
 * @param promise - 비동기 작업 Promise
 * @returns Suspense 리소스
 */
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
