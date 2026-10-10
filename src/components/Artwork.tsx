import { useId, type ReactNode } from 'react'
import { mulberry32 } from '../lib/random'
import type { Artwork as ArtworkData, ArtworkPalette } from '../data/types'

// Brand palette (house style): navy, royal, sky, sienna, orange, sage.
const PALETTES: Record<ArtworkPalette, { from: string; to: string; shapes: string[] }> = {
  navy: { from: '#0e3b57', to: '#134D71', shapes: ['#238ACB', '#56BEEC', '#E38900'] },
  sky: { from: '#238ACB', to: '#56BEEC', shapes: ['#134D71', '#DDF2FB', '#E38900'] },
  warm: { from: '#C56603', to: '#E38900', shapes: ['#134D71', '#EFD18F', '#56BEEC'] },
  sage: { from: '#00563f', to: '#007059', shapes: ['#6CA885', '#56BEEC', '#EFD18F'] },
}

/**
 * Abstract, generated illustration used instead of photos. Deterministic per
 * seed, so a post always shows the same image.
 */
export function Artwork({ artwork, className = '' }: { artwork: ArtworkData; className?: string }) {
  const gradientId = useId()
  const rand = mulberry32(artwork.seed)
  const palette = PALETTES[artwork.palette]
  const variant = artwork.seed % 3

  const shapes: ReactNode[] = []
  if (variant === 0) {
    // Overlapping circles
    for (let i = 0; i < 5; i++) {
      shapes.push(
        <circle
          key={i}
          cx={rand() * 400}
          cy={rand() * 225}
          r={40 + rand() * 110}
          fill={palette.shapes[i % palette.shapes.length]}
          opacity={0.25 + rand() * 0.35}
        />,
      )
    }
  } else if (variant === 1) {
    // Layered waves
    for (let i = 0; i < 4; i++) {
      const y = 90 + i * 35 + rand() * 20
      const a = 20 + rand() * 40
      shapes.push(
        <path
          key={i}
          d={`M0 ${y} C 100 ${y - a}, 200 ${y + a}, 400 ${y - a / 2} V225 H0 Z`}
          fill={palette.shapes[i % palette.shapes.length]}
          opacity={0.22 + i * 0.12}
        />,
      )
    }
  } else {
    // Diagonal bands with one accent dot
    for (let i = 0; i < 4; i++) {
      const x = -80 + i * 120 + rand() * 40
      shapes.push(
        <rect
          key={i}
          x={x}
          y={-60}
          width={50 + rand() * 50}
          height={360}
          transform={`rotate(${25 + rand() * 10} ${x} 112)`}
          fill={palette.shapes[i % 2]}
          opacity={0.2 + rand() * 0.25}
        />,
      )
    }
    shapes.push(<circle key="dot" cx={300 + rand() * 60} cy={60 + rand() * 40} r={22} fill={palette.shapes[2]} />)
  }

  return (
    <svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.from} />
          <stop offset="1" stopColor={palette.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill={`url(#${gradientId})`} />
      {shapes}
    </svg>
  )
}
