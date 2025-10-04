import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-8 rounded-lg shadow-lg bg-card text-card-foreground text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
        <p className="text-lg mb-6">There was an issue with your authentication code. Please try again or contact support.</p>
        <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Go to Home
        </Link>
      </div>
    </div>
  );
}
