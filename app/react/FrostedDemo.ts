import {
  createElement,
  Badge,
  Button,
  Card,
  Heading,
  Text,
  Theme,
} from 'virtual:frosted-ui'
import type { ReactNode } from 'virtual:frosted-ui'

type FrostedDemoProps = {
  onOpenStorybook?: () => void
}

function el(
  type: Parameters<typeof createElement>[0],
  props: Record<string, unknown> | null,
  ...children: ReactNode[]
) {
  return createElement(type, props, ...children)
}

export function FrostedDemo({ onOpenStorybook }: FrostedDemoProps) {
  return el(
    Theme,
    {
      appearance: 'inherit',
      grayColor: 'gray',
      accentColor: 'blue',
      infoColor: 'sky',
      successColor: 'green',
      warningColor: 'yellow',
      dangerColor: 'red',
    },
    el(
      'main',
      {
        style: {
          maxWidth: 720,
          margin: '0 auto',
          padding: '4rem 1.5rem 6rem',
          display: 'grid',
          gap: '3.5rem',
        },
      },
      el(
        'section',
        { style: { display: 'grid', gap: '1rem' } },
        el(Text, { size: '1', color: 'gray', weight: 'medium' }, 'Whop · Frosted UI'),
        el(Heading, { as: 'h1', size: '8', weight: 'bold' }, 'UI kit ready'),
        el(
          Text,
          { size: '4', color: 'gray' },
          'Frosted UI is imported into this Nuxt app — theme, styles, Tailwind tokens, and a React bridge for the design system.',
        ),
        el(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' } },
          el(Button, { size: '3', variant: 'solid', color: 'blue' }, 'Start building'),
          el(
            Button,
            {
              size: '3',
              variant: 'soft',
              color: 'gray',
              onClick: onOpenStorybook,
            },
            'Storybook docs',
          ),
        ),
      ),
      el(
        'section',
        { style: { display: 'grid', gap: '0.85rem' } },
        el(Heading, { as: 'h2', size: '5', weight: 'medium' }, 'Sample primitives'),
        el(
          Text,
          { size: '2', color: 'gray' },
          'Confirming Button, Badge, Card, and theme tokens are wired.',
        ),
        el(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' } },
          el(Badge, { color: 'green', variant: 'soft' }, 'Active'),
          el(Badge, { color: 'blue', variant: 'solid' }, 'Accent'),
          el(Badge, { color: 'gray', variant: 'surface' }, 'Draft'),
        ),
        el(
          Card,
          { size: '2', variant: 'surface' },
          el(
            'div',
            { style: { display: 'grid', gap: '0.75rem' } },
            el(Heading, { size: '4' }, 'Frosted Card'),
            el(Text, { size: '2', color: 'gray' }, 'Using design tokens via Tailwind classes too:'),
            el(
              'div',
              { className: 'text-2 leading-2 bg-blue-a3 text-blue-11 token-demo' },
              'bg-blue-a3 · text-blue-11',
            ),
          ),
        ),
      ),
    ),
  )
}

export default FrostedDemo
