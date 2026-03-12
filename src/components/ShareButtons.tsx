"use client";

import React from "react";
import { Facebook, MessageCircle, Share2, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: "property" | "minimal";
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, variant = "property" }) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
    messenger: `fb-messenger://share?link=${encodedUrl}`,
    // Web Messenger fallback or direct link
    messengerWeb: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "minimal") {
    return (
      <div className="flex items-center gap-3">
        {/* Facebook */}
        <a 
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          title="Share on Facebook"
        >
          <Facebook size={20} />
        </a>

        {/* LINE (Using Share2 icon to match screenshot if preferred, or the LINE logo) */}
        <a 
          href={shareLinks.line}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-500 hover:text-white transition-all shadow-sm"
          title="Share on LINE"
        >
          <Share2 size={20} />
        </a>

        {/* Copy Link */}
        <button 
          onClick={copyToClipboard}
          className={`p-2.5 rounded-full transition-all shadow-sm ${
            copied 
            ? "bg-green-500 text-white" 
            : "bg-gray-50 text-gray-600 hover:bg-gray-600 hover:text-white"
          }`}
          title={copied ? "Copied!" : "Copy Link"}
        >
          {copied ? <Check size={20} /> : <LinkIcon size={20} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-6 border-t border-primary-100 mt-8">
      <div className="flex items-center gap-2 text-sm font-black text-primary-950 uppercase tracking-widest">
        <Share2 size={16} className="text-primary-600" />
        Share This Property
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Facebook */}
        <a 
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-white hover:bg-[#1877F2] border-2 border-[#1877F2]/10 hover:border-[#1877F2] px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Facebook size={18} className="text-[#1877F2] group-hover:text-white transition-colors" />
          <span className="text-xs font-bold text-gray-700 group-hover:text-white transition-colors">Facebook</span>
        </a>

        {/* LINE */}
        <a 
          href={shareLinks.line}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-white hover:bg-[#06C755] border-2 border-[#06C755]/10 hover:border-[#06C755] px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <div className="w-[18px] h-[18px] text-[#06C755] group-hover:text-white transition-colors fill-current">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 10.304c0-5.23-5.39-9.456-12-9.456s-12 4.226-12 9.456c0 4.637 4.27 8.512 10.05 9.258.39.082.92.258 1.054.592.12.3-.058.776-.118 1.082l-.518 3.102c-.06.363-.29 1.422 1.25.776 1.54-.646 8.332-4.912 11.372-8.412 2.13-2.455 2.91-4.405 2.91-6.402z"/>
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-700 group-hover:text-white transition-colors">LINE</span>
        </a>

        {/* Copy Link */}
        <button 
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shadow-sm border-2 ${
            copied 
            ? "bg-green-500 border-green-500 text-white" 
            : "bg-white border-primary-50 text-gray-700 hover:border-primary-200"
          }`}
        >
          {copied ? <Check size={18} /> : <LinkIcon size={18} className="text-primary-600" />}
          <span className="text-xs font-bold">{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
