'use client'
import { motion } from 'framer-motion'
import AuthComponent from '@/components/auth/AuthComponent'
import { ThemeToggle } from '@/components/ThemeToggle'
import { FADE_IN } from '@/lib/animations'

export default function HomePageClient() {
  return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full filter blur-2xl animate-blob animation-delay-2000"></div>
        </div>

        <motion.div 
          className="w-full max-w-md z-10"
          initial="hidden"
          animate="visible"
          variants={FADE_IN}
        >
          <AuthComponent />
        </motion.div>
      </div>
  )
}

