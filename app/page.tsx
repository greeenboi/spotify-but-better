import { Button } from '@/components/ui/button';
import { TextHoverEffect } from '@/components/ui/text-hover-effect';
import Spline from '@splinetool/react-spline/next';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 relative">
      <Spline
        scene="https://prod.spline.design/C1L42urfUVHCptXq/scene.splinecode"
        className='w-full h-full overflow-clip z-0 absolute' 
      /> 
      <div className='w-full -top-0 bottom-0 absolute z-10 backdrop-blur-sm  rounded-md'>
        <TextHoverEffect text="SONDER"  />
      </div>
      <div className="min-h-24 w-full flex justify-center items-center space-y-8 text-center absolute z-10 bottom-0 backdrop-blur-2xl bg-slate-800 bg-opacity-15">
        <Button asChild className=" text-white">
          <Link href="/auth">Get Started</Link>
        </Button>
      </div>
    </main>
  )
}



