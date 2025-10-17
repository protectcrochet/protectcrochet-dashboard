// app/dashboard/layout.tsx
import type { ReactNode } from "react"
import "../globals.css"  // <- OJO: subimos un nivel

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>
}



