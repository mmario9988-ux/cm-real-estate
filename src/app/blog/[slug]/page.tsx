import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Chiang Mai Estates Blog`,
    description: post.excerpt || `${post.title} - Read more on our blog.`,
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: {
        'th': `/blog/${post.slug}`,
        'en': `/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.image 
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [{ url: "/hero-bg.jpg", width: 1200, height: 630, alt: post.title }],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
          
          <div className="flex items-center gap-4 text-sm font-bold text-primary-600 uppercase tracking-widest mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {new Date(post.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <User size={16} />
              Admin
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
            {post.title}
          </h1>

          <ShareButtons 
            url={`https://cm-real-estate.vercel.app/blog/${post.slug}`} 
            title={post.title} 
            variant="minimal"
          />
        </div>
      </div>

      {/* Main Image */}
      {post.image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-16">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl shadow-primary-900/10 border-4 border-white">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-50">
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
            {post.content.split('\n').map((paragraph: string, i: number) => (
              paragraph.trim() ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 flex justify-between items-center p-8 bg-primary-900 text-white rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h4 className="text-primary-300 font-bold uppercase tracking-wider text-sm mb-2">Continue Shopping</h4>
            <p className="text-xl font-bold">Find your dream home in Chiang Mai</p>
          </div>
          <Link 
            href="/properties" 
            className="relative z-10 bg-white text-primary-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Browse Listings
          </Link>
        </div>
      </article>
    </div>
  );
}
