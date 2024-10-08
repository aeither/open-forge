"use client"

import { cn } from "@/lib/utils"

type TColorProp = string | string[]

interface ShineBorderProps {
  borderRadius?: number
  borderWidth?: number
  duration?: number
  color?: TColorProp
  className?: string
  children: React.ReactNode
}

export default function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--border-width": `${borderWidth}px`,
          "--shine-pulse-duration": `${duration}s`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${color instanceof Array ? color.join(",") : color},transparent,transparent)`,
        } as React.CSSProperties
      }
      className={cn(
        "relative grid min-h-[60px] w-fit min-w-[300px] place-items-center rounded-[--border-radius] bg-white p-3 text-black dark:bg-black dark:text-white",
        "before:absolute before:inset-0 before:rounded-[--border-radius] before:p-[--border-width] before:bg-[--background-radial-gradient] before:bg-[length:300%_300%] before:z-[-1] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]",
        className
      )}
    >
      {children}
    </div>
  )
}
