
import "./globals.css";
import { ClerkProvider, SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton } from "@clerk/nextjs";





export const metadata = {
  title: "Rental App",
  description: "Find your next rental property with ease",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={"bg-gray-100 text-gray-900 antialiased font-sans"}
      >
        <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
