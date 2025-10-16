'use client';

export default function ExportPdfButton({
  label = 'Imprimir / PDF',
}: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #1f2937',
        background: '#111827',
        color: '#fff',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
