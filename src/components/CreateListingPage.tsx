import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateListingPageProps {
  onNavigate: (page: string) => void;
}

export function CreateListingPage({ onNavigate }: CreateListingPageProps) {
  const { currentUser, addProduct } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("electronics");
  const [listingType, setListingType] = useState("fixed");
  const [price, setPrice] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [minBidIncrement, setMinBidIncrement] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const isAuction = listingType === "auction";

    addProduct({
      sellerId: currentUser.id,
      title,
      description,
      category,
      price: isAuction ? 0 : parseFloat(price),
      images: imageUrl ? [imageUrl] : [],
      isAuction,
      startingPrice: isAuction ? parseFloat(startingPrice) : undefined,
      currentBid: isAuction ? parseFloat(startingPrice) : undefined,
      minBidIncrement: isAuction ? parseFloat(minBidIncrement) : undefined,
      endDate: isAuction ? endDate : undefined,
    });

    onNavigate("home");
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-bold text-slate-900">إضافة إعلان جديد</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>عنوان المنتج</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <Label>الوصف</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
        </div>

        <div>
          <Label>رابط صورة</Label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <Label>الفئة</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electronics">إلكترونيات</SelectItem>
              <SelectItem value="furniture">أثاث</SelectItem>
              <SelectItem value="clothes">ملابس</SelectItem>
              <SelectItem value="vehicles">مركبات</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>نوع الإعلان</Label>
          <RadioGroup value={listingType} onValueChange={setListingType}>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <RadioGroupItem value="fixed" />
              سعر ثابت
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <RadioGroupItem value="auction" />
              مزاد
            </label>
          </RadioGroup>
        </div>

        {listingType === "fixed" ? (
          <div>
            <Label>السعر ($)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
        ) : (
          <>
            <div>
              <Label>سعر البداية ($)</Label>
              <Input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>أقل زيادة للمزايدة ($)</Label>
              <Input
                type="number"
                value={minBidIncrement}
                onChange={(e) => setMinBidIncrement(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>تاريخ انتهاء المزاد</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </>
        )}

        <Button type="submit">نشر الإعلان</Button>
      </form>
    </div>
  );
}
