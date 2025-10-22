import '@emotion/react'

type AppTheme = typeof import('./theme').theme

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends AppTheme {}
}


