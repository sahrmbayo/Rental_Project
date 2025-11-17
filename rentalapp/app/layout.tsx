// app/layout.tsx
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "SL Rental",
  description: "Find your next rental property with ease",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      <html lang="en" className="scroll-auto">
        <body className="bg-gray-100 text-gray-900 antialiased font-sans dark:bg-gray-900 dark:text-gray-100">
          {children}
           <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}