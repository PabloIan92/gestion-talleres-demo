import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon
  title: string
  body: string
}) {
  return (
    <div
      className="border border-steel-200 p-8 flex flex-col items-center text-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 hover:shadow-md"
      style={{ color: 'var(--color-gray)' }}
    >
      <div className="bg-steel-100 p-4 rounded-full text-navy mb-2">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <p className="font-sans font-bold text-lg text-graphite">{title}</p>
      <p className="font-sans text-sm max-w-sm">{body}</p>
    </div>
  )
}
