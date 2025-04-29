'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export const HeaderLogo = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Link 
      href="/"
      className="flex items-center"
      aria-label="Home"
    >
      <motion.div
        className="relative h-7 w-7"
        whileHover={{ rotate: 15 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <Image 
          src="/logo.svg" 
          alt="App Logo" 
          fill
          className="object-contain"
          priority
        />
      </motion.div>
      <motion.span
        className="ml-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl font-semibold text-transparent"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        FinTrack
      </motion.span>
    </Link>
  </motion.div>
)