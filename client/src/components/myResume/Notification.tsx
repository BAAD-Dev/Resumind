"use client";

type PremiumModalProps = {
  open: boolean;
  onClose: () => void;
  message: string;
};

export default function PremiumModal({
  open,
  onClose,
  message,
}: PremiumModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-2 text-lg font-semibold">Payment Successful 🎉</h2>
        <p className="text-gray-700">{message}</p>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
