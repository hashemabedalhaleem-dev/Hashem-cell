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
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

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
      images: imagePreview ? [imagePreview] : [],
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
          <Label>صورة المنتج</Label>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="معاينة الصورة"
              className="mt-2 h-32 w-32 rounded-lg object-cover border border-slate-200"
            />
          )}
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
        </d
