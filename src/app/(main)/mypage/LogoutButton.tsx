"use client";

import { signOut } from "next-auth/react";
import PixelButton from "@/components/ui/PixelButton";

export default function LogoutButton() {
  return (
    <PixelButton
      variant="danger"
      size="md"
      className="w-full"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      로그아웃
    </PixelButton>
  );
}
