import type { Metadata } from 'next'
import { Crosshair, Ruler, RefreshCw, Monitor, Activity, Gamepad2 } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import {
  ToolBreadcrumb, ToolHeader,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection,
} from '@/components/tool'
import { SensitivityConverterClient } from './SensitivityConverterClient'

export const metadata: Metadata = {
  title: `Sensitivity Converter — CS2, Valorant, Apex & More | ${siteConfig.name}`,
  description:
    'Free mouse sensitivity converter for CS2, Valorant, Apex Legends, Fortnite and 10+ more games. Convert your sens instantly with accurate cm/360 and eDPI — no sign-up required.',
  openGraph: {
    title: `Sensitivity Converter — CS2, Valorant, Apex & More | ${siteConfig.name}`,
    description:
      'Free mouse sensitivity converter for CS2, Valorant, Apex Legends, Fortnite and 10+ more games.',
    url: `${siteConfig.url}/tools/sensitivity-converter`,
  },
  robots: { index: true, follow: true },
}

export default function SensitivityConverterPage() {
  return (
    <>
      <ToolBreadcrumb toolName="Sensitivity Converter" toolSlug="sensitivity-converter" />

      <ToolHeader
        name="Sensitivity Converter"
        description="Convert your mouse sensitivity between CS2, Valorant, Apex, Fortnite and more — keeps your exact aim feel (cm/360) the same in every game."
        categoryLabel="Game Tool"
        categoryColor="blue"
        typeLabel="Trending"
        typeColor="orange"
        updatedAt="Aug 2026"
      />

      <ToolLayout>
        <ToolSection>
          <SensitivityConverterClient />
        </ToolSection>

        <ToolSection>
          <ToolExplanation
            title="Why sensitivity doesn't carry over directly"
            paragraphs={[
              "Every game engine turns your camera a different amount per mouse \u201ccount\u201d — this is called the game's yaw value. A sensitivity of 1.0 in CS2 is not the same turn speed as 1.0 in Valorant.",
              'This converter matches your cm/360 — the physical distance your mouse travels for a full turn — so your aim feels identical when you switch games, without having to relearn your muscle memory.',
            ]}
            cards={[
              {
                icon: Crosshair,
                iconBg: 'rgba(0,229,160,0.1)',
                iconColor: 'var(--mint)',
                title: 'Yaw-based accuracy',
                body: 'Uses each game\u2019s verified yaw constant, not a rough estimate, so the math is exact.',
              },
              {
                icon: Ruler,
                iconBg: 'rgba(80,140,255,0.1)',
                iconColor: 'var(--blue)',
                title: 'cm/360 matched',
                body: 'Your physical mouse movement for a full turn stays identical across both games.',
              },
              {
                icon: RefreshCw,
                iconBg: 'rgba(255,120,64,0.1)',
                iconColor: 'var(--orange)',
                title: 'Instant, no sign-up',
                body: 'Everything recalculates live as you type — no account or download needed.',
              },
            ]}
          />
        </ToolSection>

        <ToolSection>
          <ToolHowTo
            steps={[
              { title: 'Pick your current game', description: 'Select the game your sensitivity is already dialed in for.' },
              { title: 'Pick the game to convert to', description: 'Choose the game you want a matching sensitivity for.' },
              { title: 'Enter your sensitivity and DPI', description: 'Type your exact in-game sensitivity and your mouse\u2019s DPI setting.' },
              { title: 'Read your converted sensitivity', description: 'Your new sensitivity, cm/360, and eDPI update instantly — copy or share the result.' },
            ]}
          />
        </ToolSection>

        <ToolSection last>
          <ToolFaq
            items={[
              {
                question: 'Why isn\u2019t the same sensitivity number the same feel in every game?',
                answer: 'Each game engine applies its own internal yaw multiplier to your mouse input. A sensitivity of 1.0 can mean a completely different turn speed from one game to the next, so raw numbers don\u2019t transfer directly.',
              },
              {
                question: 'What is cm/360?',
                answer: 'It\u2019s the physical distance your mouse has to travel across your mousepad for your character to make one full 360\u00b0 turn. Matching this value across games is what keeps your aim feeling consistent.',
              },
              {
                question: 'Do I need to change my DPI too?',
                answer: 'Not usually \u2014 most players keep the same DPI across games and only change in-game sensitivity. If you do use a different DPI for a specific game, use the Advanced option to enter it.',
              },
              {
                question: 'How accurate is this converter?',
                answer: 'It uses each game\u2019s verified yaw value, cross-checked against multiple sensitivity databases, so the conversion is mathematically exact for standard (non-scoped, non-accelerated) sensitivity settings.',
              },
            ]}
          />
        </ToolSection>
      </ToolLayout>

      <ToolRelated tools={[
        { name: 'PC Bottleneck Calculator', description: 'Find out if your CPU or GPU is holding back your gaming performance', slug: 'pc-bottleneck-calculator', icon: Monitor,    iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)' },
        { name: 'Reaction Speed Test',      description: 'Test your reaction time and see how you compare to other gamers',      slug: 'reaction-speed-test',      icon: Activity,   iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)'   },
        { name: 'Game Pass Calculator',     description: 'Work out if Xbox Game Pass is actually worth it for how you play',      slug: 'game-pass-calculator',     icon: Gamepad2,   iconBg: 'rgba(0,229,160,0.1)',  iconColor: 'var(--mint)'   },
      ]} />
    </>
  )
}
