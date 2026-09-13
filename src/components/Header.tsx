import { useStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react";

export function Header() {
  const { currentUser, logout } = useStore();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-emerald-700" />
        <span className="font-bold text-slate-900">هاشم سيل</span>
      </div>
      {currentUser && (
        <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-800">
          تسجيل الخروج
        </button>
      )}
    </header>
  );
}
