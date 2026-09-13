import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";

export function WantedPage() {
  const { currentUser, wantedRequests, users, addWantedRequest } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("electronics");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    addWantedRequest({
      userId: currentUser.id,
      title,
      description,
      category,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
    setTitle("");
    setDescription("");
    setMaxPrice("");
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Search className="h-5 w-5 text-emerald-700" />
          أنا أريد
        </h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          طلب جديد
        </Button>
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <Label>ماذا تريد؟</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <Label>التفاصيل</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
              </div>
              <div>
                <Label>الفئة</Label>
                <div className="flex flex-wrap gap-2">
                  {["electronics", "furniture", "clothes", "vehicles", "other"].map((cat) => (
                    <label key={cat} className="flex items-center gap-1 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label>أقصى سعر (اختياري)</Label>
                <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
              <Button type="submit">نشر الطلب</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {wantedRequests.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">لا توجد طلبات حالياً</p>
      ) : (
        <div className="flex flex-col gap-3">
          {wantedRequests.map((req) => {
            const requester = users.find((u) => u.id === req.userId);
            return (
              <Card key={req.id}>
                <CardContent className="p-3">
                  <p className="font-medium text-slate-900">{req.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{req.description}</p>
                  {req.maxPrice && (
                    <p className="mt-1 text-sm font-semibold text-emerald-700">حتى ${req.maxPrice}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-400">بواسطة {requester?.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
