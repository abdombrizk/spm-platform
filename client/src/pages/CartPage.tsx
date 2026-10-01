import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function CartPage() {
  const {
    cart,
    loading,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    proceedToCheckout,
  } = useCart();

  const items = cart?.items ?? [];

  return (
    <SiteChrome>
      <SEOHead
        title="Shopping Cart"
        description="Review your selected medical hardware and proceed to secure checkout through SPM Store."
        url="/cart"
      />
      <main className="min-h-screen bg-[#f7fafc] py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#dce7eb] pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0a4052]">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-[#617180]">
                Review your selected medical hardware and proceed to secure checkout.
              </p>
            </div>

            {items.length > 0 && (
              <Button
                variant="ghost"
                onClick={clearCart}
                disabled={loading}
                className="text-xs text-[#dc2626] hover:bg-[#fef2f2] hover:text-[#b91c1c]"
              >
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-[#dce7eb] bg-white p-12 text-center shadow-xs">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0a4052]">
                <ShoppingBag className="h-12 w-12 stroke-[1.5]" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-[#1e293b]">Your cart is currently empty</h2>
              <p className="mt-2 max-w-sm text-sm text-[#64748b]">
                You haven't added any products to your cart yet. Discover our catalog of premium medical systems and surgical sets.
              </p>
              <Button asChild className="mt-8 h-11 rounded-xl bg-[#0a4052] px-6 text-white hover:bg-[#072c38]">
                <Link href="/store">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Explore Store Catalog
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Items List */}
              <div className="lg:col-span-8">
                <div className="rounded-3xl border border-[#dce7eb] bg-white p-6 shadow-xs divide-y divide-[#f1f5f9]">
                  {items.map((item) => (
                    <div key={item.lineId} className="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      {/* Product image & title */}
                      <div className="flex items-center gap-4">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f8fafc]">
                          {item.image?.url ? (
                            <img
                              src={item.image.url}
                              alt={item.image.altText || item.productTitle}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#94a3b8]">
                              No preview
                            </div>
                          )}
                        </div>

                        <div>
                          <Link
                            href={`/store/products/${item.productHandle}`}
                            className="text-base font-bold text-[#1e293b] hover:text-[#0f6fae] transition line-clamp-2"
                          >
                            {item.productTitle}
                          </Link>
                          {item.variantTitle && item.variantTitle !== "Default Title" && (
                            <p className="mt-0.5 text-xs text-[#64748b]">{item.variantTitle}</p>
                          )}
                          <p className="mt-1 text-sm font-semibold text-[#0a4052]">
                            {formatMoney(item.unitPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Controls and line total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        {/* Qty button group */}
                        <div className="flex items-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                          <button
                            type="button"
                            disabled={loading || item.quantity <= 1}
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#64748b] hover:bg-white disabled:opacity-30 rounded-l-xl transition"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#1e293b]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-[#64748b] hover:bg-white rounded-r-xl transition"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="w-24 text-right">
                          <p className="text-base font-bold text-[#0a4052]">
                            {formatMoney(item.lineTotal)}
                          </p>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          disabled={loading}
                          className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#dc2626] transition"
                          title="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button asChild variant="outline" className="rounded-xl border-[#dce7eb] text-[#0a4052]">
                    <Link href="/store">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="sticky top-28 rounded-3xl border border-[#dce7eb] bg-white p-6 sm:p-8 shadow-md">
                  <h2 className="text-lg font-bold text-[#0a4052]">Order Summary</h2>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-[#64748b]">
                      <span>Items Count</span>
                      <span className="font-semibold text-[#1e293b]">{itemCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748b]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#1e293b]">{cart ? formatMoney(cart.subtotal) : "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#64748b]">
                      <span>Estimated Shipping & Tax</span>
                      <span>Calculated at checkout</span>
                    </div>

                    <div className="border-t border-[#f1f5f9] pt-4">
                      <div className="flex items-baseline justify-between text-base font-extrabold text-[#0a4052]">
                        <span>Estimated Total</span>
                        <span className="text-xl">{cart ? formatMoney(cart.total) : "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <Button
                      type="button"
                      disabled={loading || items.length === 0}
                      onClick={proceedToCheckout}
                      className="w-full h-12 rounded-xl bg-[#0a4052] text-sm font-bold text-white shadow-md hover:bg-[#072c38] transition active:scale-[0.99]"
                    >
                      <span>Checkout via Shopify</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-6 space-y-2.5 border-t border-[#f1f5f9] pt-6 text-xs text-[#64748b]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#0a4052]" />
                      <span>Encrypted, secure 256-bit SSL transaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#0a4052]" />
                      <span>Specialized medical equipment transport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-[#0a4052]" />
                      <span>SPM factory agency support & installation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </SiteChrome>
  );
}
