import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Federated Leukemia Diagnostics | AI-Powered Clinical Decision Support',
  description: 'Advanced multimodal AI system for acute leukemia diagnosis with explainable AI (XAI) and uncertainty quantification. Federated learning model supporting global and institution-specific local models.',
  keywords: [
    'leukemia diagnosis',
    'AI medical imaging',
    'clinical decision support',
    'federated learning',
    'explainable AI',
    'machine learning',
    'hematology',
    'medical diagnostics'
  ],
  authors: [
    {
      name: 'Federated Diagnostics Team',
      url: 'https://example.com',
    },
  ],
  creator: 'Federated Diagnostics',
  publisher: 'Medical AI Systems',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    title: 'Federated Leukemia Diagnostics',
    description: 'Advanced multimodal AI system for acute leukemia diagnosis',
    siteName: 'Federated Leukemia Diagnostics',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Federated Leukemia Diagnostics',
    description: 'Advanced multimodal AI for clinical diagnostics',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B1120" />
      </head>
      <body>{children}</body>
    </html>
  )
}