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
  LockFilled20,
  LockFilled24,
  YoutubeFilled16,
  YoutubeFilled20,
  InstagramFilled16,
  InstagramFilled20,
  TwitterFilled16,
  TwitterFilled20,
  TiktokFilled16,
  TiktokFilled20,
  DiscordFilled16,
  DiscordFilled20,
  FacebookFilled16,
  FacebookFilled20,
  TelegramFilled16,
  TelegramFilled20,
  // No filled variants in the kit — keep outline
  Twitch20,
  Linkedin20,
} from '@frosted-ui/icons'
