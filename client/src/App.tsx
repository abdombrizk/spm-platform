import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OwnerDashboard from "@/pages/OwnerDashboard";

const ProductManager = lazy(() => import("@/pages/ProductManager"));
const Catalogue = lazy(() => import("@/pages/Catalogue"));
const ItalrayPortfolio = lazy(() => import("@/pages/ItalrayPortfolio"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const ServiceManager = lazy(() => import("@/pages/ServiceManager"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetails = lazy(() => import("@/pages/ServiceDetails"));
const QuoteRequest = lazy(() => import("@/pages/QuoteRequest"));
const QuotesManager = lazy(() => import("@/pages/QuotesManager"));
const ServiceRequest = lazy(() => import("@/pages/ServiceRequest"));
const ServiceRequestsManager = lazy(() => import("@/pages/ServiceRequestsManager"));
const ContentLanding = lazy(() => import("@/pages/ContentLanding"));
const SparePartsPage = lazy(() => import("@/pages/SparePartsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const StoreCatalog = lazy(() => import("@/pages/StoreCatalog"));
const StoreProductDetail = lazy(() => import("@/pages/StoreProductDetail"));
const CartPage = lazy(() => import("@/pages/CartPage"));

function Router() {
  return (
    <Suspense fallback={<div role="status" aria-live="polite" aria-busy="true" className="flex min-h-screen items-center justify-center bg-[#f7fafc] px-5 text-center text-sm text-[#617180]"><span className="mr-3 inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#bcdde2] border-t-[#0f6fae]" aria-hidden="true" />Loading SPM page…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/owner" component={OwnerDashboard} />
        <Route path="/owner/products" component={ProductManager} />
        <Route path="/owner/services" component={ServiceManager} />
        <Route path="/catalogue" component={Catalogue} />
        <Route path="/catalogue/italray" component={ItalrayPortfolio} />
        <Route path="/catalogue/:slug" component={ProductDetails} />
        <Route path="/store" component={StoreCatalog} />
        <Route path="/store/products/:handle" component={StoreProductDetail} />
        <Route path="/cart" component={CartPage} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={ServiceDetails} />
        <Route path="/request-a-quote" component={QuoteRequest} />
        <Route path="/owner/quotes" component={QuotesManager} />
        <Route path="/request-service" component={ServiceRequest} />
        <Route path="/owner/service-requests" component={ServiceRequestsManager} />
        <Route path="/about" component={AboutPage} />
        <Route path="/maintenance-contracts" component={ContentLanding} />
        <Route path="/faqs" component={ContentLanding} />
        <Route path="/downloads" component={ContentLanding} />
        <Route path="/news" component={ContentLanding} />
        <Route path="/events" component={ContentLanding} />
        <Route path="/careers" component={ContentLanding} />
        <Route path="/spare-parts" component={SparePartsPage} />
        <Route path="/resources" component={ContentLanding} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/privacy" component={ContentLanding} />
        <Route path="/terms" component={ContentLanding} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CartDrawer />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
