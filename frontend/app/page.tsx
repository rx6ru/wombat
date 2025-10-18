'use client';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 dark-dotted-background overflow-hidden">
      <div className="z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-4">
          Wombat Vault
        </h1>

        <motion.a
          href="/signup"
          className="mt-8 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
                     h-11 px-8 
                     bg-gradient-to-br from-zinc-900 to-zinc-950 hover:from-zinc-800 hover:to-zinc-900
                     text-zinc-100 hover:text-white
                     border border-zinc-700 hover:border-zinc-500
                     shadow-lg hover:shadow-primary/30"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Get Started
        </motion.a>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute bottom-1/4 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute top-1/4 right-1/4 w-px h-1/2 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
      </div>
    </main>
  );
}

