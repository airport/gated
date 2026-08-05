/**
 * Vendor barrel — Frosted UI + shared React + icons.
 * Import from `virtual:frosted-ui` (see nuxt.config.ts esbuild plugin).
 */
export {
  createElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
  Component,
  StrictMode,
  version,
} from 'react'

export { createRoot, hydrateRoot } from 'react-dom/client'

export {
  Theme,
  Heading,
  Text,
  Button,
  Badge,
  Card,
  IconButton,
  Link,
  Spinner,
  Skeleton,
  Separator,
  Avatar,
  Callout,
  Checkbox,
  Switch,
  TextField,
  TextArea,
  Dialog,
  Select,
  Tabs,
  Tooltip,
  frostedThemePlugin,
} from 'frosted-ui'

export {
  Plus16,
  Plus20,
  Trash16,
  Trash20,
  Link16,
  Link20,
  Lock20,
  Lock24,
  Youtube16,
  Youtube20,
  Instagram16,
  Instagram20,
  Twitter16,
  Twitter20,
  Tiktok16,
  Tiktok20,
  Discord16,
  Discord20,
  Twitch16,
  Twitch20,
  Facebook16,
  Facebook20,
  Telegram16,
  Telegram20,
  Linkedin16,
  Linkedin20,
} from '@frosted-ui/icons'
