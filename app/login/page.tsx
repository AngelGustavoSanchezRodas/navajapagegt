import { LoginForm } from "@/features/auth/components/LoginForm";
import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";

export default function LoginPage() {
  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden px-4">
      <BackgroundGlow
        color="turquoise"
        className="left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5">
        <p className="text-center text-sm text-slate-600">
          Bienvenido de nuevo a NavajaGT
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
