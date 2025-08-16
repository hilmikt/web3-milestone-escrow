import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Milestone Escrow',
  description: 'Prototype UI for MilestoneEscrow'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
