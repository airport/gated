import {
  createElement,
  useMemo,
  useState,
  Theme,
  Heading,
  Text,
  Button,
  IconButton,
  TextField,
  Separator,
  Badge,
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

/** Site canvas color for the published locker — also the preview panel fill. */
const LOCKER_BG = '#0b0d10'

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
    setButtons((prev) => (prev.length <= 1 ? prev : prev.filter((b) => b.id !== id)))
  }

  const updateButton = (id: string, patch: Partial<LockerButton>) => {
    setButtons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    )
  }

  const previewButtons = useMemo(() => buttons, [buttons])

  return el(
    Theme,
    {
      appearance: 'dark',
      grayColor: 'gray',
      accentColor: 'blue',
      infoColor: 'sky',
      successColor: 'green',
      warningColor: 'yellow',
      dangerColor: 'red',
      style: { minHeight: '100vh', display: 'block' },
    },
    el(
      'div',
      { className: 'locker-shell' },
      // Left — controls
      el(
        'aside',
        { className: 'locker-controls' },
        el(
          'header',
          { className: 'locker-controls__header' },
          el(Badge, { color: 'blue', variant: 'soft', size: '1' }, 'Designer'),
          el(Heading, { as: 'h1', size: '6', weight: 'bold' }, 'Content locker'),
          el(
            Text,
            { size: '2', color: 'gray' },
            'Add unlock buttons and the URLs they open. Preview updates live on the right.',
          ),
        ),

        el(Separator, { size: '4', className: 'locker-controls__rule' }),

        el(
          'div',
          { className: 'locker-controls__list' },
          el(
            'div',
            { className: 'locker-controls__list-head' },
            el(Text, { size: '2', weight: 'medium' }, 'Buttons'),
            el(
              Text,
              { size: '1', color: 'gray' },
              `${buttons.length} total`,
            ),
          ),

          ...buttons.map((button, index) =>
            el(
              'div',
              { key: button.id, className: 'locker-button-card' },
              el(
                'div',
                { className: 'locker-button-card__top' },
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
                    color: 'red',
                    highContrast: true,
                    disabled: !canRemove,
                    'aria-label': `Remove button ${index + 1}`,
                    onClick: () => removeButton(button.id),
                  },
                  el(Trash16, null),
                ),
              ),

              el(
                'label',
                { className: 'locker-field' },
                el(Text, { size: '1', color: 'gray', as: 'span' }, 'Label'),
                el(
                  TextField.Root,
                  { size: '2' },
                  el(TextField.Input, {
                    value: button.label,
                    placeholder: 'Button label',
                    onChange: (event: { target: { value: string } }) =>
                      updateButton(button.id, { label: event.target.value }),
                  }),
                ),
              ),

              el(
                'label',
                { className: 'locker-field' },
                el(
                  'span',
                  { className: 'locker-field__label-row' },
                  el(Link16, { className: 'locker-field__icon' }),
                  el(Text, { size: '1', color: 'gray', as: 'span' }, 'URL'),
                ),
                el(
                  TextField.Root,
                  { size: '2' },
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

          el(
            Button,
            {
              size: '2',
              variant: 'soft',
              color: 'gray',
              highContrast: true,
              onClick: addButton,
              className: 'locker-add',
            },
            el(Plus16, null),
            el('span', null, 'Add button'),
          ),
        ),
      ),

      // Right — 9:16 preview of the published locker site
      el(
        'section',
        { className: 'locker-preview-stage', 'aria-label': 'Content locker preview' },
        el(
          Text,
          { size: '1', color: 'gray', className: 'locker-preview-stage__caption' },
          'Live preview · 9:16',
        ),
        el(
          'div',
          {
            className: 'locker-preview',
            style: { background: LOCKER_BG },
          },
          el(
            'div',
            { className: 'locker-preview__glow', 'aria-hidden': true },
          ),
          el(
            'div',
            { className: 'locker-preview__content' },
            el(
              'div',
              { className: 'locker-preview__lock' },
              el(Lock20, null),
            ),
            el(
              Heading,
              { as: 'h2', size: '5', weight: 'bold', align: 'center' },
              'Content locked',
            ),
            el(
              Text,
              { size: '2', color: 'gray', align: 'center', className: 'locker-preview__lede' },
              'Complete a step below to unlock.',
            ),
            el(
              'div',
              { className: 'locker-preview__actions' },
              ...previewButtons.map((button) =>
                el(
                  Button,
                  {
                    key: button.id,
                    size: '3',
                    variant: 'solid',
                    color: 'blue',
                    className: 'locker-preview__cta',
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
  )
}

export default ContentLockerHome
