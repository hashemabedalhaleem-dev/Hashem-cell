import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Package, Hammer, DollarSign, AlertTriangle, Shield } from "lucide-react";

export function AdminPage() {
  const { users, products, auctions, disputes, logout } = useStore();

  const totalSales = products
    .filter((p) => p.status === "sold")
    .reduce((sum, p) => sum + p.price, 0);

  const stats = [
    { label: "المستخدمون", value: users.length, icon: Users },
    { label: "المنتجات", value: products.length, icon: Package },
    { label: "المزادات", value: auctions.length, icon: Hammer },
    { label: "إجمالي المبيعات", value: `$${totalSales}`, icon: DollarSign },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Shield className="h-5 w-5 text-emerald-700" />
          لوحة التحكم
        </h1>
        <Button variant="outline" size="sm" onClick={logout}>
          خروج
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-3">
                <Icon className="mb-1 h-5 w-5 text-emerald-700" />
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
          <AlertTriangle className="h-4 w-4" />
          البلاغات ({disputes.length})
        </h2>
        {disputes.length === 0 ? (
          <p className="text-sm text-slate-400">لا توجد بلاغات حالياً</p>
        ) : (
          <div className="flex flex-col gap-2">
            {disputes.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-3">
                  <p className="text-sm text-slate-800">{d.reason}</p>
                  <Badge variant={d.status === "open" ? "default" : "outline"} className="mt-1">
                    {d.status === "open" ? "مفتوح" : "تم الحل"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="mb-2 text-sm font-bold text-slate-700">المستخدمون ({users.length})</h2>
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.phone}</p>
                </div>
                <Badge variant={u.role === "admin" ? "default" : "outline"}>{u.role}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
