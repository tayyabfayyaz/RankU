// app/docs/page.tsx
import React from "react"
import DocLayout from "@/app/components/docs/doc-layout"
import FeatureCard from "@/app/components/docs/feature-card"
import InteractiveWorkflow from "@/app/components/docs/interactive-workflow"
import { FEATURES, WORKFLOW_STEPS, PARTNER_GUIDE } from "@/lib/docs/data"

export default function DocsPage() {
  return (
    <DocLayout active="features">
      {/* Hero */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">RankU — Product Documentation</h1>
            <p className="text-muted-foreground mt-1">Features, partner guide and full product workflow</p>
          </div>
          <div className="flex gap-3">
            <a className="inline-block px-4 py-2 bg-primary text-white rounded" href="/signup">Get Started</a>
            <a className="inline-block px-4 py-2 border rounded" href="/">Home</a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="space-y-4">
        <h2 className="text-xl font-semibold">Core Features</h2>
        <p className="text-muted-foreground">Overview of RankU capabilities</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.id} title={f.title} short={f.short} details={f.details} icon={f.icon} />
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="space-y-4">
        <h2 className="text-xl font-semibold">Platform Workflow</h2>
        <p className="text-muted-foreground">How RankU works — from signup to automated posting</p>

        <InteractiveWorkflow steps={WORKFLOW_STEPS} />
      </section>

      {/* Partner Guide */}
      <section id="partner" className="space-y-4">
        <h2 className="text-xl font-semibold">Marketing Partner Guide</h2>
        <p className="text-muted-foreground">{PARTNER_GUIDE.overview}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {PARTNER_GUIDE.steps.map((s, idx) => (
            <div key={idx} className="p-4 bg-white rounded-lg shadow-sm">
              <h4 className="font-semibold">{s.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Next steps */}
      <section id="faq" className="space-y-4">
        <h2 className="text-xl font-semibold">Next steps & FAQ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded shadow-sm">
            <h4 className="font-semibold">How to connect social accounts?</h4>
            <p className="text-sm text-muted-foreground mt-2">From the dashboard → Social Accounts → Connect the platform and follow OAuth steps. Use the "Connect" card to start the OAuth flow.</p>
          </div>

          <div className="p-4 bg-white rounded shadow-sm">
            <h4 className="font-semibold">How to become a partner?</h4>
            <p className="text-sm text-muted-foreground mt-2">Visit /partner and register. Our team will review and enable agency features after verification.</p>
          </div>
        </div>
      </section>
    </DocLayout>
  )
}
