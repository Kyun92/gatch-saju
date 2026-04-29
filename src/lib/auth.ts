import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * OAuth Provider 등록은 env 가용성에 따라 조건부로 한다.
 * env 누락 시 Provider 자체를 등록하지 않아 NextAuth 초기화 런타임 에러를 막는다.
 * UI 측에서도 신호 환경변수(NEXT_PUBLIC_* 또는 빌드 시점 결정)로
 * 비활성 처리하는 게 이상적이지만, 1차는 서버 가드만 적용.
 */
function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
    providers.push(
      KakaoProvider({
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
      }),
    );
  }

  if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
    providers.push({
      id: "naver",
      name: "Naver",
      type: "oidc",
      issuer: "https://nid.naver.com",
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      authorization: {
        url: "https://nid.naver.com/oauth2.0/authorize",
        params: { scope: "profile email" },
      },
      token: "https://nid.naver.com/oauth2.0/token",
      userinfo: "https://openapi.naver.com/v1/nid/me",
      profile(profile: Record<string, unknown>) {
        const response = profile.response as Record<string, string> | undefined;
        return {
          id: response?.id ?? String(profile.id ?? ""),
          name: response?.name ?? response?.nickname ?? null,
          email: response?.email ?? null,
          image: response?.profile_image ?? null,
        };
      },
    });
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    );
  }

  return providers;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: buildProviders(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        // Initial sign-in: look up by OAuth provider+id first, then email fallback
        const supabase = createServerSupabaseClient();

        // 1. accounts 테이블에서 provider + provider_account_id로 기존 사용자 찾기
        const { data: existingAccount } = await supabase
          .from("accounts")
          .select("user_id")
          .eq("provider", account.provider)
          .eq("provider_account_id", account.providerAccountId)
          .single();

        if (existingAccount) {
          token.userId = existingAccount.user_id;
        } else {
          // 2. email로 기존 사용자 찾기 (fallback)
          let userId: string | null = null;

          if (user.email) {
            const { data: existingUser } = await supabase
              .from("users")
              .select("id")
              .eq("email", user.email)
              .single();
            userId = existingUser?.id ?? null;
          }

          // 3. 없으면 새 사용자 생성
          if (!userId) {
            const { data: newUser } = await supabase
              .from("users")
              .insert({
                name: user.name ?? null,
                email: user.email ?? null,
                image: user.image ?? null,
              })
              .select("id")
              .single();
            userId = newUser?.id ?? "";
          }

          // 4. accounts 테이블에 OAuth 연결 저장
          await supabase.from("accounts").insert({
            user_id: userId,
            type: account.type ?? "oauth",
            provider: account.provider,
            provider_account_id: account.providerAccountId,
            access_token: account.access_token ?? null,
            refresh_token: account.refresh_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
          });

          token.userId = userId ?? "";
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.userId = token.userId ?? "";
      return session;
    },
  },
});
