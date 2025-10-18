// Using a standard anchor tag to avoid build issues with 'next/link'
// import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-red-400">Authentication Failed</h1>
        <p className="mt-4 text-zinc-400">
          The link you used may have expired or is invalid. Please try logging in or signing up again.
        </p>
        <a
          href="/login"
          className="mt-8 inline-block rounded-md bg-zinc-700 px-6 py-2 font-medium text-white hover:bg-zinc-600"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}

