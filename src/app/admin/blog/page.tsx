"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Blog Posts</h1>
          <p className="text-gray-500 mt-1">Manage articles and news for the homepage</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/20 w-fit"
        >
          <Plus size={20} />
          Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 text-gray-500 text-sm font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    Loading posts...
                  </td>
                </tr>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {post.image ? (
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Plus size={16} />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-gray-900 line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(post.id, post.published)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          post.published
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {post.published ? <Eye size={14} /> : <EyeOff size={14} />}
                        {post.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm" suppressHydrationWarning>
                      {mounted ? new Date(post.createdAt).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
