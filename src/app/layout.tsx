import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Platform | Build software that Thinks',
  description: 'The infrastructure layer for generative applications. Integrate neural capabilities into your codebase with three lines of code.',
  openGraph: {
    title: 'AI Platform | Build software that Thinks',
    description: 'The infrastructure layer for generative applications. Integrate neural capabilities into your codebase with three lines of code.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-forsythia selection:text-oceanic">
        {children}
      </body>
    </html>
  );
}
