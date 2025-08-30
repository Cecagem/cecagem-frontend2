import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <LoginForm />
      </div>
    </div>
  );
}
