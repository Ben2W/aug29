import { SignUp } from "@clerk/nextjs";

export default function DashboardSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <SignUp
        routing="path"
        path="/dashboard/sign-up"
        signInUrl="/dashboard/sign-in"
      />
    </div>
  );
}
