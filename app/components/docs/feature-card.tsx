// components/docs/FeatureCard.tsx
"use client"

import React from "react"

export default function FeatureCard({
  title,
  short,
  details,
  icon,
}: {
  title: string
  short: string
  details: string
  icon?: string
}) {
  return (
    <article className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
          {icon ?? "⚙️"}
        </div>
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{short}</p>
          <p className="mt-3 text-sm leading-relaxed">{details}</p>
        </div>
      </div>
    </article>
  )
}
