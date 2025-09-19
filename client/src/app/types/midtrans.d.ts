declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: Record<string, any>) => void;
    };
  }
}

export {};
