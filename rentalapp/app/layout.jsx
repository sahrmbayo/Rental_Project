
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";






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
        
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
