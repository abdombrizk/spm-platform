import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OwnerDashboard from "@/pages/OwnerDashboard";
import ProductManager from "@/pages/ProductManager";
import Catalogue from "@/pages/Catalogue";
import ProductDetails from "@/pages/ProductDetails";
import ServiceManager from "@/pages/ServiceManager";
import Services from "@/pages/Services";
import ServiceDetails from "@/pages/ServiceDetails";

function Router() {
  return (
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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
