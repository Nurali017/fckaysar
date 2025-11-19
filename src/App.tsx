import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WebsitePrototype from "./pages/prototypes/WebsitePrototype";
import PlayerProfilePrototype from "./pages/prototypes/PlayerProfilePrototype";
import MobileAppPrototype from "./pages/prototypes/MobileAppPrototype";
import TicketingPrototype from "./pages/prototypes/TicketingPrototype";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/prototype/website" element={<WebsitePrototype />} />
          <Route path="/prototype/player" element={<PlayerProfilePrototype />} />
          <Route path="/prototype/mobile" element={<MobileAppPrototype />} />
          <Route path="/prototype/ticketing" element={<TicketingPrototype />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
