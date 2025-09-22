"use client";
import Link from "next/link";
import React, { useState } from "react";

const CheckIcon = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
      clipRule="evenodd"
    />
  </svg>
);

const tiers = [
  {
    name: "Free Plan",
    id: "tier-free",
    href: "#",
    priceMonthly: "Rp.0",
    description:
      "The perfect plan if you're just getting started with resume analysis.",
    features: [
      "1x Resume Analysis per day",
      "Basic ATS Score",
      "Limited Resume Templates",
      "Basic Keyword Analysis",
    ],
  },
  {
    name: "Premium Plan",
    id: "tier-premium",
    href: "#",
    priceMonthly: "Rp.29.999",
    description:
      "Dedicated support and unlimited analysis for serious job seekers.",
    features: [
      "Unlimited Resume Analyses",
      "In-depth ATS Score & Feedback",
      "All Premium Templates",
      "Job Description Analysis",
      "AI Keyword Suggestions",
      "Priority Support",
    ],
  },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  const [hoveredPlan, setHoveredPlan] = useState("Premium Plan");

  return (
    <div
      id="price"
      className="relative isolate bg-muted px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Choose the right plan for you
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Choose an affordable plan that's packed with the best features for
        landing your dream job.
      </p>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => {
          const isHovered = hoveredPlan === tier.name;
          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredPlan(tier.name)}
              className={classNames(
                isHovered
                  ? "bg-blue-700 shadow-2xl scale-105"
                  : "bg-[#162B60] scale-100 sm:mx-8 lg:mx-0",
                isHovered
                  ? "z-10"
                  : tierIdx === 0
                  ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                  : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
                "relative rounded-3xl p-8 sm:p-10 transition-all duration-300"
              )}>
              <h3
                id={tier.id}
                className="text-base font-semibold leading-7 text-white">
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-white">
                  {tier.priceMonthly}
                </span>
                {tier.name === "Premium Plan" && (
                  <span className="text-base text-blue-200">/month</span>
                )}
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
              <Link
                href="/login"
                aria-describedby={tier.id}
                className={classNames(
                  isHovered
                    ? "bg-white text-blue-600 shadow-sm hover:bg-blue-50"
                    : "bg-blue-900/50 text-white hover:bg-blue-900/70",
                  "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-300"
                )}>
                Get started today
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
