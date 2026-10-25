// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { SITE_NAME } from "./lib/constants";
import { getAppUrl } from "./lib/config";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

const description = "Find rental homes, apartments and shops across Sierra Leone, connected with verified agents.";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: { default: `${SITE_NAME} – Find your next rental in Sierra Leone`, template: `%s` },
  description,
  openGraph: { siteName: SITE_NAME, type: "website", description },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      appearance={{
        variables: { colorPrimary: "#148656", borderRadius: "0.75rem", fontFamily: "var(--font-jakarta)" },
      }}
    >
      <html lang="en" className={`scroll-auto ${jakarta.variable}`}>
        <body className="bg-gray-50 text-gray-900 antialiased font-sans dark:bg-gray-900 dark:text-gray-100">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: "9999px", fontWeight: 500 },
              success: { iconTheme: { primary: "#148656", secondary: "#fff" } },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
