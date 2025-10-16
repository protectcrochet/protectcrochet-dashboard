// app/lib/dmca/templates.ts
type T = {
  folio: string;
  title: string;
  infringingUrl: string;
  contactName: string;
  contactEmail: string;
};

export function dmcaSubject(t: T) {
  return `[DMCA] ${t.folio} — Solicitud de retirada (${t.title})`;
}

export function dmcaBodyText(t: T) {
  return [
    `A quien corresponda,`,
    ``,
    `Por medio de la presente solicito la remoción de contenido que infringe derechos de autor.`,
    `Obra afectada: ${t.title}`,
    `Ubicación infractora: ${t.infringingUrl}`,
    ``,
    `Manifiesto de buena fe que el uso no está autorizado por la titular, su agente o la ley.`,
    ``,
    `Atentamente,`,
    `${t.contactName}`,
    `${t.contactEmail}`,
    ``,
    `— English below —`,
    ``,
    `To whom it may concern,`,
    ``,
    `I hereby request removal of content that infringes the copyright.`,
    `Affected work: ${t.title}`,
    `Infringing location: ${t.infringingUrl}`,
    ``,
    `Sincerely,`,
    `${t.contactName}`,
    `${t.contactEmail}`,
  ].join("\n");
}
