import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog & Articles | Chiang Mai Estates",
  description: "Read our latest articles about real estate in Chiang Mai, property tips, and local lifestyle.",
  alternates: {
    canonical: '/blog',
    languages: {
      'th': '/blog',
      'en': '/en/blog',
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
