import './globals.css';
import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export const metadata: Metadata = {
  title: 'FIXTRAL',
  description: 'AI that fixes your images automatically from Reddit requests',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
