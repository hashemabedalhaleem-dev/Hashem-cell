import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { HomePage } from "@/components/HomePage";
import { AuthPage } from "@/components/AuthPage";
import { ProductPage } from "@/components/ProductPage";
import { AuctionsPage } from "@/components/AuctionsPage";
import { WantedPage } from "@/components/WantedPage";
import { MessagesPage } from "@/components/MessagesPage";
import { ProfilePage } from "@/components/ProfilePage";
import { AdminPage } from "@/components/AdminPage";
import { CreateListingPage } from "@/components/CreateListingPage";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

function AppContent() {
  const { currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.role === "admin") setCurrentPage("admin");
  }, [currentUser]);

  const handleNavigate = (page: string, productId?: string) => {
    if (productId) setSelectedProductId(productId);
    setCurrentPage(page);
  };

  if (!currentUser) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "product":
        return selectedProductId ? (
          <ProductPage productId={selectedProductId} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} />
        );
      case "create":
        return <CreateListingPage onNavigate={handleNavigate} />;
      case "auctions":
        return <AuctionsPage onProductClick={(id) => handleNavigate("product", id)} />;
      case "wanted":
        return <WantedPage />;
      case "messages":
        return <MessagesPage />;
      case "profile":
        return <ProfilePage />;
      case "admin":
        return <AdminPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Header />
      <main>{renderPage()}</main>
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
