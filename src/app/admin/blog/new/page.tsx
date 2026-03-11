"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon, Check } from "lucide-react";
import BlogImageUpload from "@/components/BlogImageUpload";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/blog");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Back to list
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Create New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="e.g. 5 Investment Hotspots in Chiang Mai 2026"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Excerpt (Brief Summary)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-24"
              placeholder="A short summary for the card view..."
            />
          </div>

          <div className="space-y-4">
            <BlogImageUpload 
              value={formData.image} 
              onChange={(url) => setFormData({ ...formData, image: url })} 
            />
            {/* Optional manual URL input for advanced users */}
            <div className="pt-2">
              <label htmlFor="image-url" className="text-[10px] font-black uppercase tracking-tighter text-gray-400 ml-1">
                หรือใส่ URL รูปภาพโดยตรง (Internal URL)
              </label>
              <div className="relative mt-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  id="image-url"
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Content</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-64 font-mono text-sm"
              placeholder="Write your article here..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={formData.published ? "Unpublish" : "Publish"}
              onClick={() => setFormData({ ...formData, published: !formData.published })}
              className={`w-12 h-6 rounded-full transition-all relative ${
                formData.published ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  formData.published ? "left-7" : "left-1"
                }`}
              />
            </button>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              {formData.published ? "Ready to Publish" : "Save as Draft"}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/blog"
            className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50"
          >
            {loading ? "Creating..." : <><Save size={20} /> Create Post</>}
          </button>
        </div>
      </form>
    </div>
  );
}
