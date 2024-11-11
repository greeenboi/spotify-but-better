import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to Our App</h1>
        <p className="text-xl text-gray-300">Get started on your journey with us</p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/auth">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}