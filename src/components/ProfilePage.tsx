import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Shield, Package, Heart } from "lucide-react";

export function ProfilePage() {
  const { currentUser, products, favorites, logout } = useStore();

  if (!currentUser) return null;

  const myProducts = products.filter((p) => p.sellerId === currentUser.id);
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="p-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
            {currentUser.name[0]}
          </div>
          <div>
            <p className="flex items-center gap-1 text-lg font-bold text-slate-900">
              {currentUser.name}
              {currentUser.isTrusted && <Shield className="h-4 w-4 text-emerald-600" />}
            </p>
            <p className="flex items-center gap-1 text-sm text-slate-500">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {currentUser.rating.toFixed(1)} · {currentUser.successfulSales} عملية بيع
            </p>
            <p className="text-sm text-slate-400">{currentUser.phone}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
          <Package className="h-4 w-4" />
          إعلاناتي ({myProducts.length})
        </h2>
        {myProducts.length === 0 ? (
          <p className="text-sm text-slate-400">لا توجد إعلانات بعد</p>
        ) : (
          <div className="flex flex-col gap-2">
            {myProducts.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-slate-900">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
          <Heart className="h-4 w-4" />
          المفضلة ({favoriteProducts.length})
        </h2>
        {favoriteProducts.length === 0 ? (
          <p className="text-sm text-slate-400">لا توجد عناصر مفضلة</p>
        ) : (
          <div className="flex flex-col gap-2">
            {favoriteProducts.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-slate-900">{p.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button variant="outline" className="mt-6 w-full" onClick={logout}>
        تسجيل الخروج
      </Button>
    </div>
  );
}
