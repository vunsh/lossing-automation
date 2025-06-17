"use client"

import { useSession, signOut } from "next-auth/react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as React from "react"

export default function Profile() {
  const { data: session } = useSession()
  const [open, setOpen] = React.useState(false)

  if (!session) return null

  const user = session.user || {}

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-zinc-100/10 transition-colors group"
          aria-label="Open profile menu"
        >
          <Avatar>
            <AvatarImage src={user.image} alt={user.name || "User"} />
            <AvatarFallback>
              {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""} text-zinc-400 group-hover:text-zinc-200`}
            size={18}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0 bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl overflow-hidden">
        <div className="flex flex-col items-center gap-2 px-6 py-6">
          <Avatar className="size-16 mb-2">
            <AvatarImage src={user.image} alt={user.name || "User"} />
            <AvatarFallback>
              {(user.name || user.email || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold text-zinc-900 dark:text-white">{user.name}</div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate w-full text-center">{user.email}</div>
        </div>
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
