import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ShoppingCart, Hammer, Star, Shield } from "lucide-react";

interface ProductPageProps {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
}

export function ProductPage({ productId, onNavigate }: ProductPageProps) {
  const { products, users, currentUser, favorites, toggleFavorite, placeBid, createConversation } = useStore();
  const [bidAmount, setBidAmount] = useState("");

  const product = products.find((p) => p.id === productId);
  const seller = product ? users.find((u) => u.id === product.sellerId) : null;

  if (!product || !seller) {
    return <p className="p-4 text-center text-slate-400">المنتج غير موجود</p>;
  }

  const isAuction = product.isAuction;
  const isFavorite = favorites.includes(product.id);

  const handleBid = () => {
    if (!currentUser) return;
    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) return;
    placeBid(product.id, currentUser.id, amount);
    setBidAmount("");
  };

  const handleMessage = () => {
    if (!currentUser) return;
    createConversation(seller.id, product.id);
    onNavigate("messages");
  };

  return (
    <div className="p-4">
      <div className="relative mb-4 h-64 overflow-hidden rounded-lg bg-slate-100">
        {product.images[0] && (
          <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
        )}
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2"
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
        </button>
      </div>

      <h1 className="text-xl font-bold text-slate-900">{product.title}</h1>
      <p className="mt-1 text-2xl font-bold text-emerald-700">
        ${isAuction ? product.currentBid ?? product.startingPrice : product.price}
      </p>

      <Card className="mt-4">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600">
            {seller.name[0]}
          </div>
          <div className="flex-1">
            <p className="flex items-center gap-1 text-sm font-medium text-slate-900">
              {seller.name}
              {seller.isTrusted && <Shield className="h-3.5 w-3.5 text-emerald-600" />}
            </p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {seller.rating.toFixed(1)} · {seller.successfulSales} عملية بيع
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-sm text-slate-600">{product.description}</p>

      {isAuction && (
        <Card className="mt-4">
          <CardContent className="p-3">
            <p className="mb-2 text-sm font-medium text-slate-700">
              أقل زيادة: <span className="font-semibold text-slate-800">${product.minBidIncrement}</span>
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`أدخل عرضك (${(product.currentBid ?? 0) + (product.minBidIncrement ?? 0)}+)`}
              />
              <Button onClick={handleBid}>
                <Hammer className="h-4 w-4" />
                زايد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleMessage}>
          <MessageCircle className="h-4 w-4" />
          راسل البائع
        </Button>
        {!isAuction && (
          <Button className="flex-1">
            <ShoppingCart className="h-4 w-4" />
            اشترِ الآن
          </Button>
        )}
      </div>
    </div>
  );
}
