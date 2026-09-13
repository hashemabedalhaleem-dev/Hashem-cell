import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, Clock } from "lucide-react";

interface AuctionsPageProps {
  onProductClick: (productId: string) => void;
}

export function AuctionsPage({ onProductClick }: AuctionsPageProps) {
  const { products } = useStore();
  const auctionProducts = products.filter((p) => p.isAuction && p.status === "active");

  const timeLeft = (endDate?: string) => {
    if (!endDate) return "";
    const diff = new Date(endDate).getTime() - Date.now();
    if (diff <= 0) return "انتهى";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} يوم متبقي` : "ينتهي اليوم";
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <Gavel className="h-5 w-5 text-emerald-700" />
        المزادات النشطة
      </h1>

      {auctionProducts.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">لا توجد مزادات نشطة حالياً</p>
      ) : (
        <div className="flex flex-col gap-3">
          {auctionProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer" onClick={() => onProductClick(product.id)}>
              <CardContent className="flex gap-3 p-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {product.images[0] && (
                    <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{product.title}</p>
                  <p className="mt-1 text-lg font-bold text-emerald-700">
                    ${product.currentBid ?? product.startingPrice}
                  </p>
                  <Badge variant="outline" className="mt-1 gap-1">
                    <Clock className="h-3 w-3" />
                    {timeLeft(product.endDate)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
