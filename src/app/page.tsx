import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 bg-gray-50 dark:bg-zinc-950 font-[family-name:var(--font-geist-sans)] transition-colors">
      <main className="flex flex-col gap-8 items-center text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm">
          Task List & Timesheet App
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Modern application frontend setup demonstrating Next.js App Router, Tailwind CSS, and Typescript. Built as a foundation to be integrated by Backend Developers.
        </p>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
          <Link
            className="rounded-full border border-solid border-transparent transition-all flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-base h-12 px-8 shadow-md hover:shadow-lg font-medium"
            href="/login"
          >
            Go to Login
          </Link>
          <Link
            className="rounded-full border border-solid border-gray-300 dark:border-gray-700 transition-all flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white text-base h-12 px-8 font-medium"
            href="/register"
          >
            Sign up
          </Link>
        </div>
      </main>
    </div>
  );
}
