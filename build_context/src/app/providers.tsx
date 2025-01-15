'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        userProfile: {
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none",
            navbar: "hidden",
            pageScrollBox: "py-8",
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
            formFieldLabel: "block text-gray-700 text-sm font-bold mb-2",
            formFieldInput: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            formFieldError: "text-red-500 text-xs italic",
            formFieldRow: "mb-4"
          },
        },
        signIn: {
          elements: {
            formFieldLabel: "block text-gray-700 text-sm font-bold mb-2",
            formFieldInput: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600"
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
} 