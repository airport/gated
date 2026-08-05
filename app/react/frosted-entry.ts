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
  Globe16,
  Globe20,
} from '@frosted-ui/icons'
