import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const STORAGE_KEY = "hashem-sell-data";

function loadState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return key in parsed ? parsed[key] : fallback;
  } catch {
    return fallback;
  }
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: "user" | "admin";
  rating: number;
  successfulSales: number;
  isTrusted: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  isAuction: boolean;
  startingPrice?: number;
  currentBid?: number;
  minBidIncrement?: number;
  endDate?: string;
  status: "active" | "sold" | "ended";
  createdAt: string;
}

export interface Auction {
  id: string;
  productId: string;
  bids: { userId: string; amount: number; createdAt: string }[];
}

export interface WantedRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  maxPrice?: number;
  createdAt: string;
}

export interface Offer {
  id: string;
  wantedRequestId: string;
  sellerId: string;
  message: string;
  price: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  productId?: string;
  messages: Message[];
}

export interface Dispute {
  id: string;
  productId: string;
  reporterId: string;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
}

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  auctions: Auction[];
  wantedRequests: WantedRequest[];
  offers: Offer[];
  conversations: Conversation[];
  favorites: string[];
  disputes: Dispute[];
  login: (phone: string, password: string) => boolean;
  register: (user: Omit<User, "id" | "role" | "rating" | "successfulSales" | "isTrusted" | "createdAt">) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status">) => void;
  toggleFavorite: (productId: string) => void;
  placeBid: (productId: string, userId: string, amount: number) => void;
  createConversation: (otherUserId: string, productId?: string) => Conversation;
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
  addWantedRequest: (request: Omit<WantedRequest, "id" | "createdAt">) => void;
  addOffer: (offer: Omit<Offer, "id" | "createdAt">) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_ADMIN: User = {
  id: "admin1",
  name: "مدير النظام",
  phone: "00000000",
  password: "admin123",
  role: "admin",
  rating: 5,
  successfulSales: 0,
  isTrusted: true,
  createdAt: new Date().toISOString(),
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState("currentUser", null));
  const [users, setUsers] = useState<User[]>(() => loadState("users", [DEFAULT_ADMIN]));
  const [products, setProducts] = useState<Product[]>(() => loadState("products", []));
  const [auctions, setAuctions] = useState<Auction[]>(() => loadState("auctions", []));
  const [wantedRequests, setWantedRequests] = useState<WantedRequest[]>(() => loadState("wantedRequests", []));
  const [offers, setOffers] = useState<Offer[]>(() => loadState("offers", []));
  const [conversations, setConversations] = useState<Conversation[]>(() => loadState("conversations", []));
  const [favorites, setFavorites] = useState<string[]>(() => loadState("favorites", []));
  const [disputes, setDisputes] = useState<Dispute[]>(() => loadState("disputes", []));

  useEffect(() => {
    const data = {
      currentUser,
      users,
      products,
      auctions,
      wantedRequests,
      offers,
      conversations,
      favorites,
      disputes,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors (e.g. private browsing / quota)
    }
  }, [currentUser, users, products, auctions, wantedRequests, offers, conversations, favorites, disputes]);

  const login = (phone: string, password: string) => {
    const user = users.find((u) => u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, "id" | "role" | "rating" | "successfulSales" | "isTrusted" | "createdAt">) => {
    if (users.some((u) => u.phone === userData.phone)) return false;
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      role: "user",
      rating: 0,
      successfulSales: 0,
      isTrusted: false,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const addProduct = (product: Omit<Product, "id" | "createdAt" | "status">) => {
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const placeBid = (productId: string, userId: string, amount: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, currentBid: amount } : p))
    );
    setAuctions((prev) => {
      const existing = prev.find((a) => a.productId === productId);
      const bid = { userId, amount, createdAt: new Date().toISOString() };
      if (existing) {
        return prev.map((a) =>
          a.productId === productId ? { ...a, bids: [...a.bids, bid] } : a
        );
      }
      return [...prev, { id: `auction_${Date.now()}`, productId, bids: [bid] }];
    });
  };

  const createConversation = (otherUserId: string, productId?: string) => {
    if (!currentUser) throw new Error("Not logged in");
    const existing = conversations.find(
      (c) =>
        c.participants.includes(currentUser.id) &&
        c.participants.includes(otherUserId) &&
        c.productId === productId
    );
    if (existing) return existing;
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participants: [currentUser.id, otherUserId],
      productId,
      messages: [],
    };
    setConversations((prev) => [...prev, newConv]);
    return newConv;
  };

  const sendMessage = (conversationId: string, senderId: string, content: string) => {
    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      content,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
      )
    );
  };

  const addWantedRequest = (request: Omit<WantedRequest, "id" | "createdAt">) => {
    const newRequest: WantedRequest = {
      ...request,
      id: `wanted_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWantedRequests((prev) => [...prev, newRequest]);
  };

  const addOffer = (offer: Omit<Offer, "id" | "createdAt">) => {
    const newOffer: Offer = {
      ...offer,
      id: `offer_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOffers((prev) => [...prev, newOffer]);
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        users,
        products,
        auctions,
        wantedRequests,
        offers,
        conversations,
        favorites,
        disputes,
        login,
        register,
        logout,
        addProduct,
        toggleFavorite,
        placeBid,
        createConversation,
        sendMessage,
        addWantedRequest,
        addOffer,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
}
