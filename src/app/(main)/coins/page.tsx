import { auth } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { COIN_PACKAGES } from "@/lib/coins/packages";
import CoinsClient from "./CoinsClient";

interface CoinsPageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function CoinsPage({ searchParams }: CoinsPageProps) {
  const session = await auth();
  if (!session?.user?.userId) redirect("/login");

  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase
    .from("users")
    .select("coins")
    .eq("id", session.user.userId)
    .single();

  const balance = user?.coins ?? 0;
  const { returnTo } = await searchParams;

  return (
    <CoinsClient
      packages={[...COIN_PACKAGES]}
      initialBalance={balance}
      returnTo={returnTo ?? null}
      userId={session.user.userId}
    />
  );
}
