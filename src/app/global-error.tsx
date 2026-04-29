"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="global-error-body">
        <div className="global-error-card">
          <div className="global-error-icon">!</div>
          <h1 className="global-error-title">시스템 오류</h1>
          <p className="global-error-text">
            앱 전체에 문제가 발생했습니다.
            <br />
            새로고침하거나 잠시 후 다시 시도해주세요.
          </p>
          {error.digest && (
            <p className="global-error-digest">code: {error.digest}</p>
          )}
          <button
            type="button"
            onClick={reset}
            className="global-error-button"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
