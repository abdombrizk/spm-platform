import { useState } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import type { Product, ProductVariant } from "@shared/commerce/types";
import SiteChrome from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Loader2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

function ProductView({ product }: { product: Product }) {
  const { addItem, loading: cartLoading, proceedToCheckout } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];
  const isAvailable = selectedVariant?.availableForSale ?? false;
  const currentImage = product.images[activeImageIndex] || product.images[0];
  const isQuoteOnly = product.tags.includes("Quote Only");
  const quoteHref = `/request-a-quote?equipment=${encodeURIComponent(product.title)}&brand=${encodeURIComponent(product.vendor || "Italray")}&model=${encodeURIComponent(product.handle)}`;

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return;
    setAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || !isAvailable) return;
    setAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      proceedToCheckout();
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <SEOHead
        title={product.title}
        description={product.description || `Explore ${product.title} - certified medical imaging technology distributed and supported by SPM in Egypt.`}
        image={currentImage?.url}
        url={`/store/products/${product.handle}`}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#64748b]">
        <Link href="/" className="hover:text-[#0a4052]">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/store" className="hover:text-[#0a4052]">
          Store Catalog
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-[#0a4052]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-6 shadow-xs">
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-[#f8fafc]">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#94a3b8]">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border p-1 transition ${
                      activeImageIndex === idx
                        ? "border-[#0a4052] ring-2 ring-[#0a4052]/20"
                        : "border-[#e2e8f0] hover:border-[#94a3b8]"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText || `${product.title} ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="mt-8 rounded-3xl border border-[#dce7eb] bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#0a4052]">Product Description</h2>
            <div
              className="prose prose-sm mt-4 text-[#334155] leading-relaxed max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>p]:mb-3 [&>ul>li]:mb-1"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml || `<p>${product.description}</p>`,
              }}
            />
          </div>
        </div>

        {/* Right Column: Buying Details */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl border border-[#dce7eb] bg-white p-6 sm:p-8 shadow-md">
            {/* Vendor & Status */}
            <div className="flex items-center justify-between">
              {product.vendor && (
                <span className="rounded-md bg-[#eaf4fa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  {product.vendor}
                </span>
              )}
              {isAvailable ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#047857]">
                  <CheckCircle2 className="h-4 w-4" /> In Stock & Ready to Ship
                </span>
              ) : (
                <span className="text-xs font-semibold text-[#64748b]">Sold Out</span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#1e293b] sm:text-3xl">
              {product.title}
            </h1>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="rounded-md border-[#bcdde2] text-xs font-medium text-[#0a4052]"
                >
                  {t}
                </Badge>
              ))}
            </div>

            {/* Price Box */}
            <div className="mt-6 border-y border-[#f1f5f9] py-5">
              <p className="text-xs uppercase tracking-wider text-[#94a3b8]">
                {isQuoteOnly ? "Commercial terms" : "Unit Price"}
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#0a4052]">
                  {isQuoteOnly
                    ? "Request a quote"
                    : selectedVariant
                      ? formatMoney(selectedVariant.price)
                      : formatMoney(product.priceRange.min)}
                </span>
                {!isQuoteOnly && selectedVariant?.compareAtPrice && (
                  <span className="text-base text-[#94a3b8] line-through">
                    {formatMoney(selectedVariant.compareAtPrice)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#64748b]">
                {isQuoteOnly
                  ? "Configuration, installation, training and delivery are quoted to your facility requirements."
                  : "Secure direct checkout powered by Shopify Storefront API"}
              </p>
            </div>

            {/* Multi-variant selector if present */}
            {product.variants.length > 1 && (
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">
                  Select Variant
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`rounded-xl border p-3 text-left transition ${
                        selectedVariantId === v.id
                          ? "border-[#0a4052] bg-[#eaf4fa] text-[#0a4052] font-bold shadow-xs"
                          : "border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc]"
                      }`}
                    >
                      <p className="text-xs">{v.title}</p>
                      <p className="text-xs font-semibold text-[#0a4052]">
                        {formatMoney(v.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {!isQuoteOnly && (
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#334155]">
                  Quantity
                </span>
                <div className="flex items-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || cartLoading || adding}
                    className="flex h-9 w-9 items-center justify-center text-[#64748b] hover:bg-white rounded-l-xl transition disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-[#1e293b]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={cartLoading || adding}
                    className="flex h-9 w-9 items-center justify-center text-[#64748b] hover:bg-white rounded-r-xl transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {isQuoteOnly ? (
                <Button asChild className="w-full h-12 rounded-xl bg-[#d95316] text-sm font-bold text-white shadow-md hover:bg-[#b8430e] transition active:scale-[0.99]">
                  <Link href={quoteHref}>
                    <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
                    <span>Request a Project Quote</span>
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    disabled={!isAvailable || cartLoading || adding}
                    onClick={handleAddToCart}
                    className="w-full h-12 rounded-xl bg-[#0a4052] text-sm font-bold text-white shadow-md hover:bg-[#072c38] transition active:scale-[0.99]"
                  >
                    {adding ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={!isAvailable || cartLoading || adding}
                    onClick={handleBuyNow}
                    className="w-full h-12 rounded-xl border-[#0a4052] text-[#0a4052] text-sm font-bold hover:bg-[#eaf4fa] transition"
                  >
                    <span>Buy Now with Shopify</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Value Guarantees list */}
            <div className="mt-8 space-y-3 border-t border-[#f1f5f9] pt-6 text-xs text-[#64748b]">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#0a4052]" />
                <span>SPM Authorized Agency Warranty with certified biomedical engineers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-[#0a4052]" />
                <span>White-glove clinical delivery and on-site positioning available</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="h-4 w-4 text-[#0a4052]" />
                <span>Complies with Egyptian Unified Medical Procurement & CE standards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoreProductDetail() {
  const [, params] = useRoute("/store/products/:handle");
  const handle = params?.handle || "";

  const { data: product, isLoading, error } = trpc.commerce.products.byHandle.useQuery(
    { handle },
    { enabled: Boolean(handle) }
  );

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f7fafc]">
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#0a4052]" />
            <p className="mt-4 text-sm font-semibold text-[#64748b]">Loading product from Shopify...</p>
          </div>
        ) : error || !product ? (
          <div className="mx-auto max-w-md py-20 px-5 text-center">
            <div className="rounded-2xl border border-[#dce7eb] bg-white p-8 shadow-xs">
              <h2 className="text-xl font-bold text-[#1e293b]">Product Not Found</h2>
              <p className="mt-2 text-xs text-[#64748b]">
                The requested product handle does not exist or has not been published to the storefront.
              </p>
              <Button asChild className="mt-6 rounded-xl bg-[#0a4052] text-white">
                <Link href="/store">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <ProductView product={product} />
        )}
      </main>
    </SiteChrome>
  );
}
