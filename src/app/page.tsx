import Link from "next/link";

import { auth } from "@/server/auth";
import { HydrateClient, api } from "@/trpc/server";
import { Hero } from "@/components/hero";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <Hero session={session} />
      </main>
    </HydrateClient>
  );
}
