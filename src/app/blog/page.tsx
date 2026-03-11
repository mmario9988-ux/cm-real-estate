"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogListingPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/posts?published=true");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            {t("property.backToHome") || "Back to Home"}
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
            บทความและสาระน่ารู้
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            อัปเดตข่าวสารอสังหาริมทรัพย์ เคล็ดลับการแต่งบ้าน และไลฟ์สไตล์ในเชียงใหม่
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-[500px] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-900/5 flex flex-col">
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  {post.image ? (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 italic">No Image</div>
                  )}
                </Link>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-bold text-primary-600 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      Admin
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-500 line-clamp-3 mb-8 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 font-bold px-6 py-2.5 rounded-xl hover:bg-primary-600 hover:text-white transition-all group/btn"
                  >
                    อ่านรายละเอียด <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400 italic">Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
