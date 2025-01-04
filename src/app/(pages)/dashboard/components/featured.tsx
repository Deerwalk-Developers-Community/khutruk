import { CategoryTypes } from '@prisma/client'

interface FeaturedProps {
  image: string
  title: string
  raised: string
  description: string
  category: CategoryTypes
}

export default function Featured({ image, title, raised, description, category }: FeaturedProps) {
  return (
    <div className="w-[45%] rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6">
        {image && (
          <img
            src={image}
            alt={title}
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}
        <div className="space-y-1.5 p-3">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Raised: ${raised}</span>
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

