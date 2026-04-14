"use client";

import { signIn } from "next-auth/react";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelButton from "@/components/ui/PixelButton";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#f5f0e8" }}
    >
      {/* Title */}
      <div className="text-center mb-12">
        <h1
          className="text-4xl mb-3 animate-px-glow inline-block px-6 py-2"
          style={{
            fontFamily: "var(--font-pixel)",
            color: "#9a7040",
            textShadow: "0 0 16px rgba(154,112,64,0.4), 0 0 32px rgba(154,112,64,0.2)",
          }}
        >
          ✦ 천명 ✦
        </h1>
        <p
          className="text-lg"
          style={{
            fontFamily: "var(--font-pixel)",
            color: "#9a7040",
          }}
        >
          운명의 사주풀이
        </p>
      </div>

      {/* Login Card */}
      <PixelFrame variant="accent" className="w-full max-w-sm p-6">
        <div className="flex flex-col gap-4">
          <p
            className="text-center text-sm mb-2"
            style={{ fontFamily: "var(--font-pixel)", color: "#4a3e2c" }}
          >
            모험을 시작하려면 로그인하세요
          </p>

          {/* Kakao */}
          <button
            onClick={() => signIn("kakao", { callbackUrl: "/daily" })}
            className="pixel-btn w-full px-5 py-3 text-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              backgroundColor: "#FEE500",
              color: "#191919",
              border: "2px solid #E5CF00",
              borderBottomWidth: "4px",
              boxShadow: "0 2px 0 #B8A600",
            }}
          >
            카카오로 시작하기
          </button>

          {/* Naver */}
          <button
            onClick={() => signIn("naver", { callbackUrl: "/daily" })}
            className="pixel-btn w-full px-5 py-3 text-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              backgroundColor: "#03C75A",
              color: "#FFFFFF",
              border: "2px solid #02A84C",
              borderBottomWidth: "4px",
              boxShadow: "0 2px 0 #018A3E",
            }}
          >
            네이버로 시작하기
          </button>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/daily" })}
            className="pixel-btn w-full px-5 py-3 text-sm"
            style={{
              fontFamily: "var(--font-pixel)",
              backgroundColor: "#FFFFFF",
              color: "#333333",
              border: "2px solid #DDDDDD",
              borderBottomWidth: "4px",
              boxShadow: "0 2px 0 #BBBBBB",
            }}
          >
            Google로 시작하기
          </button>
        </div>
      </PixelFrame>

      {/* Blinking text */}
      <p
        className="mt-10 animate-blink text-sm"
        style={{
          fontFamily: "var(--font-pixel)",
          color: "#8a8070",
        }}
      >
        새로운 모험을 시작하세요
      </p>
    </div>
  );
}
