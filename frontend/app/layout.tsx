import './globals.css';
import Providers from './providers';

export const metadata = { title:'Milestone Escrow', description:'Prototype UI' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
