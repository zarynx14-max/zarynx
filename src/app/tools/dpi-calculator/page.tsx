import type { Metadata } from 'next'
import { Crosshair, Ruler, Gauge, Monitor, Activity, Gamepad2 } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import {
  ToolBreadcrumb, ToolHeader,
  ToolExplanation, ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection,
} from '@/components/tool'
import { DpiCalculatorClient } from './DpiCalculatorClient'

export const metadata: Metadata = {
  title: `DPI & eDPI Calculator — cm/360, Mouse Pad Fit & Same-Feel DPI | ${siteConfig.name}`,
  description:
    'Free DPI and eDPI calculator. Get your eDPI and cm per 360 for Valorant, CS2, Apex and 10+ more games, check that a turn fits your mouse pad, and keep the same feel when you change DPI.',
  openGraph: {
    title: `DPI & eDPI Calculator — cm/360, Mouse Pad Fit & Same-Feel DPI | ${siteConfig.name}`,
    description:
      'Turn your mouse DPI and in-game sensitivity into eDPI and cm per 360, check mouse pad fit, and convert DPI without changing your aim feel. Free, no sign-up.',
    url: `${siteConfig.url}/tools/dpi-calculator`,
  },
  robots: { index: true, follow: true },
}

export default function DpiCalculatorPage() {
  return (
    <>
      <ToolBreadcrumb toolName="DPI & eDPI Calculator" toolSlug="dpi-calculator" />

      <ToolHeader
        name="DPI & eDPI Calculator"
        description="Turn your mouse DPI and in-game sensitivity into eDPI and cm per 360, check that a turn fits on your mouse pad, and keep the same feel when you change DPI."
        categoryLabel="Mouse Tool"
        categoryColor="mint"
        typeLabel="Calculator"
        typeColor="blue"
        updatedAt="Oct 2026"
        usersPerMonth="New"
      />

      <ToolLayout wide>
        <ToolSection>
          <DpiCalculatorClient />
        </ToolSection>

        <ToolSection>
          <ToolExplanation
            title="Why DPI alone doesn't tell you your sensitivity"
            paragraphs={[
              'Your real turn speed depends on three things together: your mouse DPI, your in-game sensitivity, and the game\u2019s own yaw value. Two players can run very different DPI and still turn exactly the same amount for the same hand movement.',
              'eDPI (DPI \u00d7 sensitivity) compares players inside one game. cm per 360 is the physical distance your mouse travels for a full turn, so it works across games and tells you whether a turn will fit on your mouse pad.',
            ]}
            cards={[
              { icon: Gauge, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)', title: 'eDPI and cm per 360', body: 'Both numbers update live as you type, in centimeters or inches.' },
              { icon: Ruler, iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)', title: 'Mouse pad check', body: 'See at a glance whether a 180\u00b0 or full 360\u00b0 turn fits your pad.' },
              { icon: Crosshair, iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)', title: 'Keep your feel', body: 'Change DPI and get the exact sensitivity that keeps your aim the same.' },
            ]}
          />
        </ToolSection>

        <ToolSection>
          <ToolHowTo
            steps={[
              { title: 'Pick your game', description: 'Choose the game you play. Each game turns a different amount per mouse count, so this matters.' },
              { title: 'Enter your DPI and sensitivity', description: 'Type the DPI from your mouse software and the exact sensitivity from your game settings.' },
              { title: 'Read your numbers', description: 'See your eDPI, your cm per 360, and whether a turn fits your mouse pad if you added its width.' },
              { title: 'Changing DPI or mouse?', description: 'Use Same feel at other DPI, or Change DPI, to get the new sensitivity that keeps your aim the same.' },
            ]}
          />
        </ToolSection>

        <ToolSection last>
          <ToolFaq
            items={[
              { question: 'What is eDPI?', answer: 'eDPI is your mouse DPI multiplied by your in-game sensitivity. In the same game, two players with the same eDPI turn at the same speed, even if their DPI is different.' },
              { question: 'Why can the same eDPI feel different in two games?', answer: 'Each game turns a different number of degrees per mouse count. cm per 360 removes that difference, so compare games by cm per 360 instead of eDPI. To move your sensitivity between games, use the Sensitivity Converter.' },
              { question: 'Does a higher DPI make me turn faster?', answer: 'Not by itself. Turn speed depends on DPI and sensitivity together. If you double your DPI and halve your sensitivity, you turn the same amount for the same hand movement.' },
              { question: 'How accurate is this calculator?', answer: 'The math is exact: cm per 360 is 360 divided by (yaw \u00d7 DPI \u00d7 sensitivity), times 2.54. It uses the same game yaw values as our Sensitivity Converter, so the two tools always agree. It does not account for mouse acceleration or scoped sensitivity.' },
              { question: 'My game only accepts a few decimals. What should I do?', answer: 'Use Change DPI and set how many decimals your game accepts. It shows the closest value and how much faster or slower that rounding makes you turn.' },
              { question: 'Where are my saved setups stored?', answer: 'Only in your browser, so they will not appear on another device. Use Copy link to move a setup between devices.' },
            ]}
          />
        </ToolSection>
      </ToolLayout>

      <ToolRelated tools={[
        { name: 'Sensitivity Converter', description: 'Convert your sensitivity between CS2, Valorant, Apex and more', slug: 'sensitivity-converter', icon: Crosshair, iconBg: 'rgba(80,140,255,0.1)', iconColor: 'var(--blue)' },
        { name: 'Reaction Speed Test', description: 'Test your reaction time and see how you compare to other gamers', slug: 'reaction-speed-test', icon: Activity, iconBg: 'rgba(255,120,64,0.1)', iconColor: 'var(--orange)' },
        { name: 'PC Bottleneck Calculator', description: 'Find out if your CPU or GPU is holding back your gaming performance', slug: 'pc-bottleneck-calculator', icon: Monitor, iconBg: 'rgba(0,229,160,0.1)', iconColor: 'var(--mint)' },
      ]} />
    </>
  )
}
