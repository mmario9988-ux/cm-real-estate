import LoginForm from "@/components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin Login | Chiang Mai Estates",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center text-primary-600 hover:text-primary-800 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to main site
          </Link>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-900">
          Agent Portal
        </h2>
        <p className="mt-2 text-center text-sm text-primary-700">
          Sign in to manage properties and inquiries
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-primary-900/5 sm:rounded-2xl sm:px-10 border border-primary-100">
          <LoginForm />
        </div>
        
        <div className="mt-8 text-center text-sm font-medium text-primary-800">
          <p>Demo Credentials:</p>
          <p className="mt-1">Email: admin@example.com | Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
