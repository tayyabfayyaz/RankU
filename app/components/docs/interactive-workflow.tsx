// components/docs/InteractiveWorkflow.tsx
"use client"

import React, { useState } from "react"

export default function InteractiveWorkflow({ steps }: { steps: { id: string; title: string; summary: string; details: string }[] }) {
  const [active, setActive] = useState(steps[0]?.id || "")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1 space-y-2">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`block text-left w-full p-3 rounded-lg transition ${
              active === s.id ? "bg-primary/10 border border-primary" : "bg-white hover:shadow-sm"
            }`}
          >
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.summary}</div>
          </button>
        ))}
      </div>

      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {steps.map((s) => (
            <div key={s.id} className={`${active === s.id ? "block" : "hidden"}`}>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground mb-4">{s.summary}</p>
              <p className="leading-relaxed">{s.details}</p>
            </div>
          ))}

          <div className="mt-6 flex gap-3">
            <button
              className="px-3 py-2 rounded bg-primary text-white"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(steps.find(s => s.id === active) || {}, null, 2))}
            >
              Copy Step JSON
            </button>
            <a
              className="px-3 py-2 rounded border hover:bg-gray-50"
              href={`/api/export-workflow?step=${active}`}
            >
              Export Step (JSON)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
