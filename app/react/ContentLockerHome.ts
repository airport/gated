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
  Badge,
  Card,
  Plus16,
  Trash16,
  Link16,
  Lock20,
  Pencil16,
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

/** Published locker site canvas — fills the inset preview panel. */
const LOCKER_BG = '#11131a'

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
      infoColor: 'sky',
      successColor: 'green',
      warningColor: 'amber',
      dangerColor: 'red',
      className: 'locker-theme',
    },
    el(
      'div',
      { className: 'locker-page' },
      el(
        'div',
        { className: 'locker-frame' },
        // —— Left: Whop-style controls ——
        el(
          'aside',
          { className: 'locker-side' },
          el(
            'div',
            { className: 'locker-brand' },
            el('span', { className: 'locker-brand__mark', 'aria-hidden': true }),
            el(Text, { size: '3', weight: 'bold' }, 'Gated'),
          ),

          el(
            'div',
            { className: 'locker-side__intro' },
            el(
              Heading,
              { as: 'h1', size: '7', weight: 'bold' },
              'Design your locker',
            ),
            el(
              Text,
              { size: '2', color: 'gray', className: 'locker-side__sub' },
              'Configure unlock buttons and destinations. The panel on the right is your live site preview.',
            ),
          ),

          el(
            'div',
            { className: 'locker-side__meta' },
            el(Badge, { size: '1', variant: 'soft', color: 'blue' }, 'Buttons'),
            el(Text, { size: '1', color: 'gray' }, `${buttons.length} configured`),
          ),

          el(
            'div',
            { className: 'locker-form' },
            ...buttons.map((button, index) =>
              el(
                Card,
                {
                  key: button.id,
                  size: '2',
                  variant: 'surface',
                  className: 'locker-row',
                },
                el(
                  'div',
                  { className: 'locker-row__head' },
                  el(
                    'div',
                    { className: 'locker-row__title' },
                    el(
                      Text,
                      { size: '2', weight: 'medium' },
                      `Button ${index + 1}`,
                    ),
                    el(
                      Text,
                      { size: '1', color: 'gray' },
                      button.label || 'Untitled',
                    ),
                  ),
                  el(
                    IconButton,
                    {
                      size: '2',
                      variant: 'ghost',
                      color: 'gray',
                      highContrast: true,
                      disabled: !canRemove,
                      'aria-label': `Remove button ${index + 1}`,
                      onClick: () => removeButton(button.id),
                    },
                    el(Trash16, null),
                  ),
                ),

                el(
                  'div',
                  { className: 'locker-row__fields' },
                  el(
                    'div',
                    { className: 'locker-field' },
                    el(
                      Text,
                      { size: '1', weight: 'medium', color: 'gray', as: 'label' },
                      'Label',
                    ),
                    el(
                      TextField.Root,
                      { size: '3', variant: 'surface' },
                      el(TextField.Slot, null, el(Pencil16, null)),
                      el(TextField.Input, {
                        value: button.label,
                        placeholder: 'e.g. Join Discord',
                        onChange: (event: { target: { value: string } }) =>
                          updateButton(button.id, {
                            label: event.target.value,
                          }),
                      }),
                    ),
                  ),
                  el(
                    'div',
                    { className: 'locker-field' },
                    el(
                      Text,
                      { size: '1', weight: 'medium', color: 'gray', as: 'label' },
                      'Destination URL',
                    ),
                    el(
                      TextField.Root,
                      { size: '3', variant: 'surface' },
                      el(TextField.Slot, null, el(Link16, null)),
                      el(TextField.Input, {
                        value: button.url,
                        placeholder: 'https://…',
                        inputMode: 'url',
                        onChange: (event: { target: { value: string } }) =>
                          updateButton(button.id, { url: event.target.value }),
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),

          el(Separator, { size: '4', className: 'locker-sep' }),

          el(
            Button,
            {
              size: '3',
              variant: 'solid',
              color: 'blue',
              onClick: addButton,
              className: 'locker-add',
            },
            el(Plus16, null),
            el('span', null, 'Add button'),
          ),
        ),

        // —— Right: inset rounded panel (reference-style) ——
        el(
          'section',
          { className: 'locker-panel-wrap', 'aria-label': 'Locker preview' },
          el(
            'div',
            {
              className: 'locker-panel',
              style: { background: LOCKER_BG },
            },
            el('div', {
              className: 'locker-panel__wash',
              'aria-hidden': true,
            }),
            el(
              'div',
              { className: 'locker-panel__inner' },
              el(
                'div',
                { className: 'locker-panel__badge' },
                el(Lock20, null),
              ),
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
                {
                  size: '2',
                  align: 'center',
                  className: 'locker-panel__copy',
                },
                'Complete a step below to unlock access.',
              ),
              el(
                'div',
                { className: 'locker-panel__actions' },
                ...buttons.map((button) =>
                  el(
                    Button,
                    {
                      key: button.id,
                      size: '3',
                      variant: 'solid',
                      color: 'blue',
                      highContrast: true,
                      className: 'locker-panel__cta',
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
