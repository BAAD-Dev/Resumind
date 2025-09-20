export default function Checkout() {
  return (
    <form className="flex flex-col items-center text-sm text-slate-800 mt-20">
      <h1 className="text-4xl font-bold py-4 text-center">Checkout</h1>
      <p className="max-md:text-sm text-gray-500 pb-10 text-center">
        Enter your details to complete your purchase and confirm your order.
      </p>

      <div className="max-w-96 w-full px-4">
        <label htmlFor="name" className="font-medium">
          Name
        </label>
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18.311 16.406a9.64 9.64 0 0 0-4.748-4.158 5.938 5.938 0 1 0-7.125 0 9.64 9.64 0 0 0-4.749 4.158.937.937 0 1 0 1.623.938c1.416-2.447 3.916-3.906 6.688-3.906 2.773 0 5.273 1.46 6.689 3.906a.938.938 0 0 0 1.622-.938M5.938 7.5a4.063 4.063 0 1 1 8.125 0 4.063 4.063 0 0 1-8.125 0"
              fill="#475569"
            />
          </svg>
          <input
            type="text"
            className="h-full px-2 w-full outline-none bg-transparent"
            placeholder="Enter your name"
            required
          />
        </div>

        <label htmlFor="email-address" className="font-medium mt-4">
          Email
        </label>
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.5 3.438h-15a.937.937 0 0 0-.937.937V15a1.563 1.563 0 0 0 1.562 1.563h13.75A1.563 1.563 0 0 0 18.438 15V4.375a.94.94 0 0 0-.938-.937m-2.41 1.874L10 9.979 4.91 5.313zM3.438 14.688v-8.18l5.928 5.434a.937.937 0 0 0 1.268 0l5.929-5.435v8.182z"
              fill="#475569"
            />
          </svg>
          <input
            type="email"
            className="h-full px-2 w-full outline-none bg-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>

        <label htmlFor="email-address" className="font-medium mt-4">
          Phone
        </label>
        <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 rounded-full focus-within:ring-2 focus-within:ring-indigo-400 transition-all overflow-hidden">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 
           19.79 19.79 0 0 1-8.63-3.07 
           19.5 19.5 0 0 1-6-6 
           19.79 19.79 0 0 1-3.07-8.63 
           A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 
           1.72c.12.81.37 1.6.72 2.33a2 2 0 0 1-.45 
           2.11L8.09 8.91a16 16 0 0 0 6 
           6l.75-.75a2 2 0 0 1 2.11-.45c.73.35 
           1.52.6 2.33.72a2 2 0 0 1 1.72 2z"
            />
          </svg>

          <input
            type="email"
            className="h-full px-2 w-full outline-none bg-transparent"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <button
          type="submit"
          className="font-semibold flex items-center justify-center gap-1 mt-10 bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 w-full rounded-full transition">
          Checkout
        </button>
      </div>
    </form>
  );
}
