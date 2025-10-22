import { css, Global, ThemeProvider } from '@emotion/react'

export const colors = {
  background: '#0b0b0c',
  surface: '#141417',
  text: '#e5e7eb',
  subtext: '#a1a1aa',
  accent: '#e35f00',
  muted: '#27272a',
  border: '#2e2e32',
}

export const theme = {
  colors,
  radii: { sm: 6, md: 10, lg: 14, round: 999 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 },
  fonts: {
    body: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
  },
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Global
        styles={css`
          :root { color-scheme: dark; }
          html, body, #root { height: 100%; }
          body { margin: 0; background: ${colors.background}; color: ${colors.text}; font-family: ${theme.fonts.body}; }
          * { box-sizing: border-box; }
          a { color: inherit; text-decoration: none; }
        `}
      />
      {children}
    </ThemeProvider>
  )
}


