import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      {/* Left Column - Sign Up Form */}
      <div className='h-full flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-6'>
          <div className='text-center space-y-2'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Create Your Account
            </h1>
            <p className='text-gray-600'>
              Get started
            </p>
          </div>

          <div className='mt-8'>
            <ClerkLoading>
              <div className='flex flex-col items-center justify-center space-y-4'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
                <p className='text-gray-500'>Loading sign-up form...</p>
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <SignUp 
                path='/sign-up'
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'w-full shadow-none border-0',
                    headerTitle: 'text-gray-900',
                    headerSubtitle: 'text-gray-600',
                    socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
                    formFieldInput: 'focus:ring-2 focus:ring-blue-500',
                    footerActionText: 'text-gray-600',
                    footerActionLink: 'text-blue-600 hover:text-blue-500',
                  }
                }}
                signInUrl='/sign-in'
              />
            </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* Right Column - Branding */}
      <div className='hidden lg:flex h-full bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12'>
        <div className='text-center'>
          <Image 
            src="/logo.svg" 
            height={200} 
            width={200} 
            alt='Company Logo'
            priority
            className='drop-shadow-lg mx-auto'
          />
          <p className='mt-2 text-blue-100 max-w-md'>
            Manage your Finances
          </p>
        </div>
      </div>
    </div>
  )
}