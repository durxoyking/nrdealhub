export type Product = {
  id: number;
  title: string;
  category: string;
  brand: string;
  image: string;
  country: string;
  currentPrice: number;
  oldPrice: number;
  lowBuyPrice: number;
  targetSellPrice: number;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  seller: string;
  status: "Live" | "Pending";
};

export const seedProducts: Product[] = [
  {
    id: 1,
    title: "Global Smartphone Deal",
    category: "Electronics",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    country: "Global",
    currentPrice: 32000,
    oldPrice: 42000,
    lowBuyPrice: 35000,
    targetSellPrice: 45000,
    stock: 18,
    rating: 5,
    reviews: 210,
    description: "Low price smartphone deal. Buyer can buy now, seller can resell when market price increases.",
    features: ["Global product", "Low price alert", "Resale opportunity"],
    seller: "NRDealHub Official",
    status: "Live",
  },
  {
    id: 2,
    title: "Nike Style Shoe",
    category: "Fashion",
    brand: "Nike",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    country: "USA / Global",
    currentPrice: 5200,
    oldPrice: 6500,
    lowBuyPrice: 5500,
    targetSellPrice: 7200,
    stock: 25,
    rating: 5,
    reviews: 160,
    description: "Fashion shoe product with own-site buy, cart and sell flow.",
    features: ["Fashion product", "Buy low", "Sell high suggestion"],
    seller: "NRDealHub Official",
    status: "Live",
  },
  {
    id: 3,
    title: "AliExpress Gadget Bundle",
    category: "Gadget",
    brand: "AliExpress",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    country: "China / Global",
    currentPrice: 1800,
    oldPrice: 2500,
    lowBuyPrice: 2000,
    targetSellPrice: 3000,
    stock: 40,
    rating: 4,
    reviews: 280,
    description: "Gadget bundle that can be bought from NRDealHub and resold later.",
    features: ["Gadget bundle", "Budget friendly", "High demand product"],
    seller: "NRDealHub Official",
    status: "Live",
  },
  {
    id: 4,
    title: "Web Hosting Premium Deal",
    category: "Digital Service",
    brand: "Hostinger",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    country: "Global",
    currentPrice: 2999,
    oldPrice: 5999,
    lowBuyPrice: 3500,
    targetSellPrice: 6500,
    stock: 100,
    rating: 5,
    reviews: 90,
    description: "Digital hosting product with checkout and success flow inside NRDealHub.",
    features: ["Digital product", "Global service", "High commission potential"],
    seller: "NRDealHub Official",
    status: "Live",
  },
  {
    id: 5,
    title: "VPN Privacy Deal",
    category: "Digital Service",
    brand: "VPN",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    country: "Global",
    currentPrice: 1700,
    oldPrice: 2800,
    lowBuyPrice: 2000,
    targetSellPrice: 3200,
    stock: 80,
    rating: 4,
    reviews: 75,
    description: "VPN privacy deal with buy/sell suggestion inside your platform.",
    features: ["Privacy service", "Digital order", "Secure checkout"],
    seller: "NRDealHub Official",
    status: "Live",
  },
  {
    id: 6,
    title: "Laptop Accessories Pack",
    category: "Electronics",
    brand: "Accessories",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    country: "Bangladesh / Global",
    currentPrice: 1200,
    oldPrice: 1800,
    lowBuyPrice: 1400,
    targetSellPrice: 2200,
    stock: 32,
    rating: 5,
    reviews: 130,
    description: "Laptop accessories pack for local and global marketplace buyers.",
    features: ["Low price product", "Cart supported", "Seller resale option"],
    seller: "NRDealHub Official",
    status: "Live",
  },
];

export function getProductById(id: string | number, extraProducts: Product[] = []) {
  return [...seedProducts, ...extraProducts].find((product) => product.id === Number(id));
}

export function getPriceSignal(product: Product) {
  if (product.currentPrice <= product.lowBuyPrice) {
    return {
      label: "Low Price — Buy Now",
      type: "buy",
      message: "এই product-এর দাম এখন কম। কিনে রাখার জন্য ভালো opportunity হতে পারে।",
    };
  }

  if (product.currentPrice >= product.targetSellPrice) {
    return {
      label: "High Price — Sell Now",
      type: "sell",
      message: "এই product-এর market price এখন বেশি। Sell করলে লাভের সুযোগ হতে পারে।",
    };
  }

  return {
    label: "Hold / Watch",
    type: "watch",
    message: "দাম normal range-এ আছে। Watchlist-এ রাখুন।",
  };
}
