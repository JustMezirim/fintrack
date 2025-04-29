'use client'

import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AuthPage() {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      {/* Left Column - Auth Form */}
      <div className='h-full flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <motion.div
          className='w-full max-w-md space-y-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='text-center space-y-4'>
            <motion.h1 
              className='text-3xl font-bold text-gray-900'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Welcome Back!
            </motion.h1>
            <motion.p 
              className='text-gray-600'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Log in or create an account to access your dashboard
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ClerkLoading>
              <div className='flex justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <SignIn 
                path='/sign-in'
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'w-full shadow-none border-0',
                    headerTitle: 'text-gray-900',
                    headerSubtitle: 'text-gray-600',
                    socialButtonsBlockButton: 'border-gray-300',
                    footerActionText: 'text-gray-600',
                    footerActionLink: 'text-blue-600 hover:text-blue-500',
                  }
                }}
              />
            </ClerkLoaded>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column - Branding */}
      <div className='hidden lg:flex h-full bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center'
        >
          <Image 
            src="/logo.svg" 
            height={200} 
            width={200} 
            alt='Company Logo'
            priority
            className='drop-shadow-lg mx-auto'
          />
          <motion.h2 
            className='mt-6 text-3xl font-bold text-white'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your Financial Companion
          </motion.h2>
          <motion.p 
            className='mt-2 text-blue-100'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Manage your Finances
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}