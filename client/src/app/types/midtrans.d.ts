declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: Record<string, unknown>) => void;
    };
  }
}

export {};
