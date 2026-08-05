import {
  createElement,
  useState,
  Theme,
  Heading,
  Text,
  Button,
  IconButton,
  TextField,
  Separator,
  Plus16,
  Trash16,
  Link16,
  Lock20,
  type ReactNode,
} from 'virtual:frosted-ui'

type LockerButton = {
  id: string
  label: string
  url: string
}

function el(
  type: Parameters<typeof createElement>[0],
  props: Record<string, unknown> | null,
  ...children: ReactNode[]
) {
  return createElement(type, props, ...children)
}

function uid() {
  return `btn_${Math.random().toString(36).slice(2, 9)}`
}

const DEFAULT_BUTTONS: LockerButton[] = [
  { id: uid(), label: 'Join Discord', url: 'https://discord.gg/' },
  { id: uid(), label: 'Follow on X', url: 'https://x.com/' },
]

/**
 * Locker site canvas. Also drives the page atmosphere so the inset panel
 * reads as cut out of the same background (reference “flower bit” effect).
 */
const CANVAS =
  'radial-gradient(120% 80% at 50% 0%, #3b82f6 0%, #1e3a8a 32%, #0b1224 68%, #070a12 100%)'

export function ContentLockerHome() {
  const [buttons, setButtons] = useState<LockerButton[]>(DEFAULT_BUTTONS)
  const canRemove = buttons.length > 1

  const addButton = () => {
    setButtons((prev) => [
      ...prev,
      { id: uid(), label: 'New button', url: 'https://' },
    ])
  }

  const removeButton = (id: string) => {
    setButtons((prev) =>
      prev.length <= 1 ? prev : prev.filter((b) => b.id !== id),
    )
  }

  const updateButton = (id: string, patch: Partial<LockerButton>) => {
    setButtons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    )
  }

  return el(
    Theme,
    {
      appearance: 'dark',
      grayColor: 'slate',
      accentColor: 'blue',
      className: 'gated-theme',
    },
    el(
      'div',
      { className: 'gated-page' },
      // Same canvas as the inset panel — blurred / scaled so the panel feels embedded
      el('div', {
        className: 'gated-page__atmosphere',
        style: { backgroundImage: CANVAS },
        'aria-hidden': true,
      }),
      el('div', { className: 'gated-page__dim', 'aria-hidden': true }),

      el(
        'div',
        { className: 'gated-shell' },
        // LEFT — clean Whop-like controls (built from scratch)
        el(
          'main',
          { className: 'gated-form' },
          el(
            'div',
            { className: 'gated-form__top' },
            el(Text, { size: '4', weight: 'bold', className: 'gated-logo' }, 'gated'),
            el(
              Heading,
              { as: 'h1', size: '8', weight: 'bold', className: 'gated-title' },
              'Welcome',
            ),
            el(
              Text,
              { size: '2', color: 'gray', className: 'gated-lede' },
              'Build unlock buttons for your content locker. Preview updates on the right.',
            ),
          ),

          el(
            'div',
            { className: 'gated-form__body' },
            ...buttons.map((button, index) =>
              el(
                'div',
                { key: button.id, className: 'gated-item' },
                el(
                  'div',
                  { className: 'gated-item__bar' },
                  el(
                    Text,
                    { size: '1', weight: 'medium', color: 'gray' },
                    `Button ${index + 1}`,
                  ),
                  el(
                    IconButton,
                    {
                      size: '1',
                      variant: 'ghost',
                      color: 'gray',
                      disabled: !canRemove,
                      'aria-label': `Remove button ${index + 1}`,
                      onClick: () => removeButton(button.id),
                    },
                    el(Trash16, null),
                  ),
                ),
                el(
                  TextField.Root,
                  { size: '3', variant: 'surface', className: 'gated-input' },
                  el(TextField.Input, {
                    value: button.label,
                    placeholder: 'Button label',
                    onChange: (e: { target: { value: string } }) =>
                      updateButton(button.id, { label: e.target.value }),
                  }),
                ),
                el(
                  TextField.Root,
                  { size: '3', variant: 'surface', className: 'gated-input' },
                  el(TextField.Slot, null, el(Link16, null)),
                  el(TextField.Input, {
                    value: button.url,
                    placeholder: 'https://destination.url',
                    inputMode: 'url',
                    onChange: (e: { target: { value: string } }) =>
                      updateButton(button.id, { url: e.target.value }),
                  }),
                ),
              ),
            ),

            el(
              Button,
              {
                size: '3',
                variant: 'soft',
                color: 'gray',
                highContrast: true,
                className: 'gated-add',
                onClick: addButton,
              },
              el(Plus16, null),
              el('span', null, 'Add button'),
            ),
          ),

          el(Separator, { size: '4', className: 'gated-form__rule' }),

          el(
            Text,
            { size: '1', color: 'gray', className: 'gated-form__foot' },
            'Sign up / auth comes later — design only for now.',
          ),
        ),

        // RIGHT — inset “flower bit”: padded panel cut from the shared atmosphere
        el(
          'aside',
          { className: 'gated-embed', 'aria-label': 'Locker preview' },
          el(
            'div',
            {
              className: 'gated-embed__panel',
              style: { backgroundImage: CANVAS },
            },
            el(
              'div',
              { className: 'gated-embed__content' },
              el('div', { className: 'gated-embed__icon' }, el(Lock20, null)),
              el(
                Heading,
                {
                  as: 'h2',
                  size: '6',
                  weight: 'bold',
                  align: 'center',
                  highContrast: true,
                },
                'Content locked',
              ),
              el(
                Text,
                { size: '2', align: 'center', className: 'gated-embed__copy' },
                'Complete a step below to unlock.',
              ),
              el(
                'div',
                { className: 'gated-embed__actions' },
                ...buttons.map((button) =>
                  el(
                    Button,
                    {
                      key: button.id,
                      size: '3',
                      variant: 'solid',
                      color: 'blue',
                      className: 'gated-embed__cta',
                      onClick: () => {
                        if (!button.url) return
                        window.open(button.url, '_blank', 'noopener,noreferrer')
                      },
                    },
                    button.label || 'Untitled',
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}

export default ContentLockerHome
