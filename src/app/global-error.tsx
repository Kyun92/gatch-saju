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
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#f5f0e8",
          color: "#2c2418",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "'Noto Sans KR', system-ui, -apple-system, sans-serif",
          padding: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #b8944c",
            padding: "1.5rem",
            maxWidth: "360px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "2.25rem",
              color: "#d04040",
              marginBottom: "0.75rem",
              fontWeight: 700,
            }}
          >
            !
          </div>
          <h1
            style={{
              fontSize: "1rem",
              color: "#d04040",
              marginBottom: "0.75rem",
              fontWeight: 600,
            }}
          >
            시스템 오류
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "#4a3e2c", marginBottom: "1.5rem" }}>
            앱 전체에 문제가 발생했습니다.
            <br />
            새로고침하거나 잠시 후 다시 시도해주세요.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.625rem", color: "#8a8070", marginBottom: "1rem" }}>
              code: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              backgroundColor: "#9a7040",
              color: "#ffffff",
              border: "none",
              padding: "0.625rem 1.5rem",
              fontSize: "0.8125rem",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
