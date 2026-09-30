import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    loading,
    itemCount,
    updateQuantity,
    removeItem,
    proceedToCheckout,
  } = useCart();

  const items = cart?.items ?? [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (!open ? closeCart() : null)}>
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col bg-white p-0 sm:max-w-md"
        aria-describedby={undefined}
      >
        {/* Header */}
        <SheetHeader className="border-b border-[#e2e8f0] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#0a4052]" />
              <SheetTitle className="text-lg font-bold text-[#0a4052]">
                Your Cart
              </SheetTitle>
              <span className="rounded-full bg-[#eaf4fa] px-2.5 py-0.5 text-xs font-semibold text-[#0a4052]">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f1f5f9] text-[#94a3b8]">
                <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#1e293b]">Your cart is empty</h3>
              <p className="mt-1 text-xs text-[#64748b] max-w-[240px]">
                Explore our catalog of certified medical devices and precision surgical instruments.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-xl border-[#bcdde2] text-[#0a4052] hover:bg-[#eaf4fa]"
                onClick={() => {
                  closeCart();
                }}
              >
                <Link href="/store">Browse Store Catalog</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#f1f5f9]">
              {items.map((item) => (
                <div key={item.lineId} className="flex gap-4 pt-4 first:pt-0">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.image.altText || item.productTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[#94a3b8]">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/store/products/${item.productHandle}`}
                          onClick={closeCart}
                          className="text-sm font-bold text-[#1e293b] hover:text-[#0f6fae] line-clamp-2"
                        >
                          {item.productTitle}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.lineId)}
                          disabled={loading}
                          className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#dc2626] transition"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.variantTitle && item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-[#64748b] mt-0.5">{item.variantTitle}</p>
                      )}
                      <p className="mt-1 text-xs font-semibold text-[#0a4052]">
                        {formatMoney(item.unitPrice)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
                        <button
                          type="button"
                          disabled={loading || item.quantity <= 1}
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-[#64748b] hover:bg-white disabled:opacity-30 rounded-l-lg transition"
                          title="Decrease quantity"
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
                          className="flex h-7 w-7 items-center justify-center text-[#64748b] hover:bg-white rounded-r-lg transition"
                          title="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#1e293b]">
                        {formatMoney(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with subtotal and checkout */}
        {items.length > 0 && cart && (
          <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748b]">Subtotal</span>
                <span className="font-bold text-[#1e293b]">{formatMoney(cart.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#64748b]">
                <span>Taxes & Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-2 text-base font-bold text-[#0a4052]">
                <span>Total</span>
                <span>{formatMoney(cart.total)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Button
                type="button"
                className="w-full h-12 rounded-xl bg-[#0a4052] text-sm font-bold text-white shadow-md hover:bg-[#072c38] transition active:scale-[0.99]"
                onClick={proceedToCheckout}
                disabled={loading || items.length === 0}
              >
                <span>Proceed to Shopify Checkout</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex w-full items-center justify-center py-2 text-xs font-semibold text-[#0a4052] hover:underline"
              >
                <span>View Full Cart Page</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
