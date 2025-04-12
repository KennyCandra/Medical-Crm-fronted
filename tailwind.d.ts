// tailwind.d.ts
declare module 'tailwindcss' {
    export interface TailwindConfig {
      content: string[]
      theme: {
        extend: {
          colors: {
            primary: string
            secondary: string
            tertiary: string
            fourth: string
          }
        }
      }
      plugins: []
    }
  }
  
  // Declare custom classes
  interface CustomClasses {
    'text-primary-100': string;
    'primary-100': string;
    'bg-primary-100': string;
    'bg-secondary-100': string;
    'bg-tertiary-100': string;
    'bg-fourth-100': string;
    'text-secondary-100': string;
    'text-tertiary-100': string;
    'text-fourth-100': string;
  }
  
  declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      className?: string & keyof CustomClasses;
    }
  }