import { SignUp } from "@clerk/nextjs";
import Logo from "../../components/Logo";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-brand-50 via-white to-accent-50 px-4">
      <Logo />
      <SignUp appearance={{ elements: { formButtonPrimary: "bg-brand-600 hover:bg-brand-700 rounded-full" } }} />
    </div>
  );
}
