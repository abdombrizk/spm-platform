import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
const OwnerDashboard = lazy(() => import("@/pages/OwnerDashboard"));
const ProductManager = lazy(() => import("@/pages/ProductManager"));
const Catalogue = lazy(() => import("@/pages/Catalogue"));
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

function Router() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f7fafc] text-sm text-[#617180]">Loading SPM page…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/owner" component={OwnerDashboard} />
        <Route path="/owner/products" component={ProductManager} />
        <Route path="/owner/services" component={ServiceManager} />
        <Route path="/catalogue" component={Catalogue} />
        <Route path="/catalogue/:slug" component={ProductDetails} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={ServiceDetails} />
        <Route path="/request-a-quote" component={QuoteRequest} />
        <Route path="/owner/quotes" component={QuotesManager} />
        <Route path="/request-service" component={ServiceRequest} />
        <Route path="/owner/service-requests" component={ServiceRequestsManager} />
        <Route path="/about" component={ContentLanding} />
        <Route path="/maintenance-contracts" component={ContentLanding} />
        <Route path="/faqs" component={ContentLanding} />
        <Route path="/downloads" component={ContentLanding} />
        <Route path="/news" component={ContentLanding} />
        <Route path="/events" component={ContentLanding} />
        <Route path="/careers" component={ContentLanding} />
        <Route path="/spare-parts" component={SparePartsPage} />
        <Route path="/resources" component={ContentLanding} />
        <Route path="/contact" component={ContentLanding} />
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
