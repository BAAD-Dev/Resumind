"use client";
import Link from "next/link";
import { useState } from "react";

export default function Price() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const dataCustomer = {
      orderId: "order-" + Date.now(),
      amount: 20000,
      customerName: "garin",
      customerEmail: "garin@mail.com",
      customerPhone: "081111030205",
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataCustomer),
      }
    );

    const requestData = await response.json();
    console.log(requestData);

    setLoading(false);

    if (!requestData?.token) {
      alert("❌ No token received from server");
      return;
    }

    if (requestData?.token) {
      window.snap.pay(requestData.token, {
        // Disini Berarti penempatan webhook nya
        onSuccess: (result: any) => console.log("success", result),
        onPending: (result: any) => console.log("pending", result),
        onError: (result: any) => console.error("error", result),
        onClose: () =>
          alert("You closed the popup without finishing the payment"),
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Free Tier */}
      <div className="border rounded-2xl shadow-md p-6 text-center flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Free Tier</h3>
          <p className="mt-2 text-gray-500">Try our CV analyzer for free.</p>
          <p className="text-2xl font-bold text-indigo-600 mt-4">Rp 0</p>
          <ul className="text-sm text-gray-600 mt-4 space-y-1">
            <li>✔ 1x CV Analysis</li>
            <li>✔ Basic ATS Score</li>
            <li>✔ Limited Features</li>
          </ul>
        </div>
        <Link
          href="/checkout"
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Checkout
        </Link>
      </div>

      {/* Basic Plan */}
      <div className="border rounded-2xl shadow-md p-6 text-center flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Basic Plan</h3>
          <p className="mt-2 text-gray-500">
            One-time CV scan with AI insights.
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-4">Rp 20.000</p>
          <ul className="text-sm text-gray-600 mt-4 space-y-1">
            <li>✔ 1 CV Scan</li>
            <li>✔ ATS Report</li>
            <li>✔ Keyword Suggestions</li>
          </ul>
        </div>
        <Link
          href="/checkout"
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Checkout
        </Link>
      </div>

      {/* Pro Subscription */}
      <div className="border rounded-2xl shadow-md p-6 text-center bg-indigo-50 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700">
            Pro Subscription
          </h3>
          <p className="mt-2 text-gray-600">
            Best for jobseekers actively applying.
          </p>
          <p className="text-2xl font-bold text-indigo-700 mt-4">
            Rp 99.000 <span className="text-sm font-normal">/bulan</span>
          </p>
          <ul className="text-sm text-gray-700 mt-4 space-y-1">
            <li>✔ Unlimited Scans</li>
            <li>✔ Full ATS & Skills Analysis</li>
            <li>✔ Job-Match Recommendations</li>
          </ul>
        </div>
        <button
          onClick={handleCheckout}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
