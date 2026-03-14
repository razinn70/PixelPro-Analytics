import { content } from '@/data/content'

export default function About() {
  const { about } = content

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">{about.headline}</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{about.subhead}</p>
      </div>

      {/* Founder */}
      <div className="bg-surface rounded-2xl p-8 border border-border mb-12 flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-16 h-16 bg-dark rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          👨‍💻
        </div>
        <div>
          <p className="font-bold text-lg">{about.owner.name}</p>
          <p className="text-primary text-sm mb-3">{about.owner.title}</p>
          <p className="text-text-secondary">{about.owner.bio}</p>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {about.values.map(v => (
          <div key={v.title} className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
            <p className="text-text-secondary text-sm">{v.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
