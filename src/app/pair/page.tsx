import type { Metadata } from "next";
import { PairClient } from "./PairClient";

export const metadata: Metadata = {
  title: "Link device · LoolyTv",
  description: "Approve a LoolyTv device pairing code",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ code?: string }>;
};

export default async function PairPage({ searchParams }: Props) {
  const params = await searchParams;
  const code = (params.code ?? "").trim().toUpperCase();

  return <PairClient code={code} />;
}
