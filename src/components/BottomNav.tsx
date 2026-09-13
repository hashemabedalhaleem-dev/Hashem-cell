import { Home, Gavel, Search, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const items = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "auctions", label: "المزادات", icon: Gavel },
    { id: "wanted", label: "أنا أريد", icon: Search },
    { id: "messages", label: "الرسائل", icon: MessageCircle },
    { id: "profile", label: "حسابي", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-slate-200 bg-white py-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
              isActive ? "text-emerald-700" : "text-slate-400"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
