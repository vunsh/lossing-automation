"use client"

import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { signIn } from "next-auth/react"

export default function Home() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `
          url("/background.png"),
          repeating-linear-gradient(
            135deg,
            rgba(255,255,255,0.03) 0px,
            rgba(255,255,255,0.03) 2px,
            transparent 2px,
            transparent 40px
          )
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#fff"
              strokeWidth="0.5"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 rounded-xl bg-black/40 backdrop-blur-md shadow-2xl border border-white/10">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#ff1a1a] via-white to-[#ff1a1a] bg-clip-text pb-2 text-transparent drop-shadow-[0_0_8px_#ff1a1a88]">
          Lossing <span className="text-white/90">Automation</span>
        </h1>
        <p className="text-zinc-200 text-base font-light text-center max-w-xs">
          Sign in to access report automation tools.
        </p>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 py-6 text-lg font-semibold hover:text-white border-zinc-300/30 text-white hover:bg-[#ff1a1a]/20 hover:border-[#ff1a1a] transition-all shadow-[0_0_12px_0_#ff1a1a33] backdrop-blur"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <LogIn className="text-2xl text-[#ff1a1a] drop-shadow-[0_0_6px_#ff1a1a99]" />
          <span className="font-semibold">Sign in with Google</span>
        </Button>
        <div className="mt-2 text-center text-xs text-zinc-300">
          Only certain emails are allowed to access this page.<br />
          If you are not able to access and you think you should, please contact the administrator.
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-10 blur-3xl rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#ff1a1a] opacity-10 blur-2xl rounded-full pointer-events-none z-0" />
    </div>
  )
}
