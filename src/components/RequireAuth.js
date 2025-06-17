"use client"

import React, { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function RequireAuth({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notAllowed, setNotAllowed] = useState(false)
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
    if (status === "authenticated") {
      const approved = (process.env.NEXT_PUBLIC_APPROVED_USERS || "")
        .split(" ")
        .map(e => e.trim())
        .filter(Boolean)
      const email = session?.user?.email
      if (!email || !approved.includes(email)) {
        setNotAllowed(true)
        let countdown = 5
        setSeconds(countdown)
        const interval = setInterval(() => {
          countdown -= 1
          setSeconds(countdown)
        }, 1000)
        setTimeout(() => {
          clearInterval(interval)
          signOut({ callbackUrl: "/login" })
        }, 5000)
        return () => clearInterval(interval)
      }
    }
  }, [status, session, router])

  if (status === "loading") {
    return null 
  }

  if (notAllowed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">You are not allowed to access this page.</p>
            <p className="mb-4 text-muted-foreground">
              You will be logged out in {seconds} second{seconds !== 1 ? "s" : ""}.
            </p>
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full"
            >
              Log out now
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
