// app/pricing/page.tsx
export const dynamic = "force-dynamic";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

// ====== CONFIG ======
const PREMIUM_PRICE = 29999;
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:8000";

// (Opsional) helper format rupiah
function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ====== SERVER ACTION ======
async function upgradeAction(_formData: FormData) {
  "use server";

  const payload = {
    orderId: "order-" + Date.now(),
    amount: PREMIUM_PRICE,
    customerName: "garin",
    customerEmail: "garin@mail.com",
    customerPhone: "081111030205",
  };

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${BACKEND_BASE_URL}/api/payments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg =
      data?.message ?? `Gagal membuat pembayaran (status: ${res.status})`;
    throw new Error(msg);
  }

  if (data?.redirect_url) {
    redirect(data.redirect_url as string);
  }

  if (data?.token) {
    redirect(`https://app.sandbox.midtrans.com/snap/v2/vtweb/${data.token}`);
  }

  throw new Error("Server tidak mengembalikan redirect_url atau token.");
}

const tiers = [
  {
    name: "Free Plan",
    id: "tier-free",
    priceMonthly: "Rp.0",
    description:
      "The perfect plan if you're just getting started with resume analysis.",
    features: ["Basic ATS Score", "Basic Keyword Analysis", "Simple Feedback"],
    isPremium: false,
  },
  {
    name: "Premium Plan",
    id: "tier-premium",
    priceMonthly: "Rp.29.999",
    description:
      "Dedicated support and unlimited analysis for serious job seekers.",
    features: [
      "Unlimited Resume Analyses",
      "In-depth ATS Score & Feedback",
      "Job Description Matching & Scoring",
      "AI Keyword Suggestions",
      "Strengths and improvement areas highlighted",
      "And more...",
    ],
    isPremium: true,
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? ""}
      aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div
      id="price"
      className="relative isolate bg-muted px-6 py-10 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          One Payment Away from Premium
        </p>
      </div>

      <div className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Unlock powerful AI tools to analyze your CV, match with jobs, and boost
        your chances — all just one payment away.
        <p className="mt-5">
          Upgrade now and take control of your career journey!
        </p>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-10 text-sm font-medium text-blue-700 hover:text-blue-900">
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Link>
      </div>

      <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, idx) => (
          <div
            key={tier.id}
            className={[
              "group relative rounded-3xl p-8 sm:p-10 transition-all duration-300",
              "bg-[#162B60] hover:bg-blue-700 hover:shadow-2xl hover:scale-105",
              idx === 0
                ? "sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
            ].join(" ")}>
            <h3
              id={tier.id}
              className="text-base font-semibold leading-7 text-white">
              {tier.name}
            </h3>

            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-4xl font-bold tracking-tight text-white">
                {tier.priceMonthly}
              </span>
            </p>

            <p className="mt-6 text-base leading-7 text-blue-100">
              {tier.description}
            </p>

            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-blue-100 sm:mt-10">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-white" />
                  {feature}
                </li>
              ))}
            </ul>

            {tier.isPremium ? (
              <form action={upgradeAction} className="mt-8">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-md px-3.5 py-2.5 text-center text-sm font-semibold transition-colors duration-300 bg-white text-blue-600 shadow-sm hover:bg-blue-50">
                  Upgrade Now
                </button>
              </form>
            ) : (
              <Link
                href="/"
                aria-describedby={tier.id}
                className="mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold transition-colors duration-300 bg-blue-900/50 text-white hover:bg-blue-900/70">
                Get started free
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
