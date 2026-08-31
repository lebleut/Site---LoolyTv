import type { Metadata } from "next";
import { ResetPasswordClient } from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Reset password · LoolyTv",
  description: "Reset your LoolyTv parent account password",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams;
  const token = (params.token ?? "").trim();

  return <ResetPasswordClient token={token} />;
}
