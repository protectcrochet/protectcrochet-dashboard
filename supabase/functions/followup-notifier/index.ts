// supabase/functions/followup-notifier/index.ts
// Deno Edge Function to email reminders 48h before follow_up_at for open cases
// Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NOTIFY_FROM, NOTIFY_REPLY_TO

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") || "ProtectCrochet <onboarding@resend.dev>";
const NOTIFY_REPLY_TO = Deno.env.get("NOTIFY_REPLY_TO") || "kroshapattern@gmail.com";

type CaseRow = {
  id: string
  title: string | null
  contact_email: string | null
  account_id: string
  follow_up_at: string | null
  status: string
  source_domain: string | null
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [to],
      subject,
      html,
      reply_to: NOTIFY_REPLY_TO
    })
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Resend error ${res.status}: ${t}`)
  }
}

function renderEmail(c: CaseRow) {
  const when = c.follow_up_at ? new Date(c.follow_up_at).toLocaleString() : "N/A"
  const dom = c.source_domain ?? "sitio"
  const title = c.title ?? "Caso sin título"
  return `
  <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI">
    <h2>Recordatorio de seguimiento (48h)</h2>
    <p>Tienes un seguimiento programado para este caso:</p>
    <ul>
      <li><strong>Título:</strong> ${title}</li>
      <li><strong>Dominio:</strong> ${dom}</li>
      <li><strong>Fecha follow-up:</strong> ${when}</li>
    </ul>
    <p>Ingresa al dashboard para actualizar el estado o reprogramar.</p>
  </div>`
}

Deno.serve(async (_req) => {
  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { global: { headers: { "x-client-info": "followup-notifier" }}})
    const now = new Date()
    const in48h = new Date(now.getTime() + 48*60*60*1000)
    // Trae casos abiertos con follow_up_at dentro de las próximas 48h
    const { data, error } = await sb
      .from("cases")
      .select("id,title,contact_email,account_id,follow_up_at,status,source_domain")
      .eq("status", "open")
      .gte("follow_up_at", now.toISOString())
      .lte("follow_up_at", in48h.toISOString())
    if (error) throw error

    const cases = (data ?? []) as CaseRow[]

    let sent = 0, skipped = 0
    for (const c of cases) {
      if (!c.contact_email) { skipped++; continue }
      // Evitar duplicados: revisa si ya existe un log del día
      const { data: existing, error: logErr } = await sb
        .from("case_log")
        .select("id, created_at")
        .eq("case_id", c.id)
        .eq("event", "follow_up_notice_sent")
        .gte("created_at", new Date(now.getTime() - 12*60*60*1000).toISOString()) // últimas 12h
      if (logErr) throw logErr
      if (existing && existing.length > 0) { skipped++; continue }

      await sendEmail(c.contact_email, "Recordatorio de seguimiento (48h) – ProtectCrochet", renderEmail(c))

      await sb.from("case_log").insert({
        case_id: c.id,
        event: "follow_up_notice_sent",
        message: "Se envió recordatorio 48h antes de follow_up_at",
        meta: { hours_before: 48 }
      })
      sent++
    }

    return new Response(JSON.stringify({ ok: true, total: cases.length, sent, skipped }), {
      headers: { "content-type": "application/json" }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
})
