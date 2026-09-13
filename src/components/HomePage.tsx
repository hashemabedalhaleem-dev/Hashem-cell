import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Gavel, Plus } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { products, favorites, toggleFavorite } = useStore();
  const activeProducts = products.filter((p) => p.status === "active");

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">أحدث الإعلانات</h2>
        <Button size="sm" onClick={() => onNavigate("create")}>
          <Plus className="h-4 w-4" />
          أضف إعلان
        </Button>
      </div>

      {activeProducts.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">لا توجد منتجات حالياً</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {activeProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer overflow-hidden"
              onClick={() => onNavigate("product", product.id)}
            >
              <div className="relative h-32 bg-slate-100">
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-slate-500"
                    }`}
                  />
                </button>
                {product.isAuction && (
                  <Badge className="absolute left-2 top-2 gap-1">
                    <Gavel className="h-3 w-3" />
                    مزاد
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="truncate text-sm font-medium text-slate-900">{product.title}</p>
                <p className="mt-1 font-bold text-emerald-700">
                  ${product.isAuction ? product.currentBid ?? product.startingPrice : product.price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
