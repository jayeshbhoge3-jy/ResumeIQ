import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-white border-b border-[#E5E7EB] h-16 px-6 flex justify-between items-center">
      <Link href="/" className="font-heading font-bold text-2xl tracking-tighter cursor-pointer text-[#1FC79B] flex items-center gap-2">
        {/* Small teal icon */}
        <div className="w-6 h-6 rounded-md bg-[#1FC79B] flex items-center justify-center text-white text-sm font-bold shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <span>ResumeIQ</span>
      </Link>

      <div className="hidden md:flex gap-8 items-center text-[#6B7280] font-medium text-sm">
        <Link href="/history" className="hover:text-[#1FC79B] transition-colors">
          History
        </Link>
        <Link href="/upload" className="hover:text-[#1FC79B] transition-colors">
          Scan Resume
        </Link>
      </div>

      <div className="flex gap-3 md:gap-4 items-center">
        <Link href="/history" className="hidden sm:block text-sm font-medium text-[#6B7280] border border-[#E5E7EB] px-5 py-2 rounded-lg hover:border-[#1FC79B] hover:text-[#1FC79B] transition-all">
          Sign in
        </Link>
        <Link href="/upload" className="bg-[#1FC79B] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#18a982] transition-all">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
