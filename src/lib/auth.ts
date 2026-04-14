import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const NaverProvider: Provider = {
  id: "naver",
  name: "Naver",
  type: "oidc",
  issuer: "https://nid.naver.com",
  clientId: process.env.NAVER_CLIENT_ID!,
  clientSecret: process.env.NAVER_CLIENT_SECRET!,
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
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign-in: look up or create user in Supabase
        const supabase = createServerSupabaseClient();

        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email!)
          .single();

        if (existingUser) {
          token.userId = existingUser.id;
        } else {
          const { data: newUser } = await supabase
            .from("users")
            .insert({
              name: user.name ?? null,
              email: user.email,
              image: user.image ?? null,
            })
            .select("id")
            .single();

          token.userId = newUser?.id ?? "";
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
