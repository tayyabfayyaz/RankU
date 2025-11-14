// components/docs/DocLayout.tsx
"use client"

import React from "react"
import Link from "next/link"

export default function DocLayout({
  children,
  active = "overview",
}: {
  children: React.ReactNode
  active?: string
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-bold">RankU Docs</h2>
                <p className="text-sm text-muted-foreground mt-1">Product, workflow & partner guide</p>
              </div>

              <nav className="p-4 bg-white rounded-lg shadow-sm">
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#features"
                      className={`block px-3 py-2 rounded ${active === "features" ? "bg-primary/10 font-semibold" : "hover:bg-gray-100"}`}
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#workflow"
                      className={`block px-3 py-2 rounded ${active === "workflow" ? "bg-primary/10 font-semibold" : "hover:bg-gray-100"}`}
                    >
                      Workflow
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#partner"
                      className={`block px-3 py-2 rounded ${active === "partner" ? "bg-primary/10 font-semibold" : "hover:bg-gray-100"}`}
                    >
                      Partner Guide
                    </Link>
                  </li>
                  <li>
                    <a href="#faq" className="block px-3 py-2 rounded hover:bg-gray-100">
                      FAQ
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" className="inline-block text-sm text-primary underline">
                    Go to Dashboard
                  </Link>
                  <Link href="/signup" className="inline-block text-sm text-primary underline">
                    Getting started
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-span-12 lg:col-span-9 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
