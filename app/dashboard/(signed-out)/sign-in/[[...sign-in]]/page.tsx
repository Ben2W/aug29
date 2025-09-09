import { SignIn } from "@clerk/nextjs";

export default function DashboardSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <SignIn
        routing="path"
        path="/dashboard/sign-in"
        signUpUrl="/dashboard/sign-up"
      />
    </div>
  );
}
