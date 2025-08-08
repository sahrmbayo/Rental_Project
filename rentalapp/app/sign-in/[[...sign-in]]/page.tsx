import { SignIn } from "@clerk/nextjs";


import React from "react";export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-gradient-to-r from-blue-500 to-pink-500 hover:opacity-90",
          },
        }}
      />
    </div>
  );
}