import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Import Pages
import Home from "@/pages/Home";
import QueueStatus from "@/pages/QueueStatus";
import Accept from "@/pages/Accept";
import Confirmed from "@/pages/Confirmed";
import Expired from "@/pages/Expired";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminActivity from "@/pages/admin/Activity";

import { AnnouncementBanner } from "@/components/AnnouncementBanner";

function Router() {
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <AnnouncementBanner />}
      <div className={!isAdminPage ? "pt-[30px] md:pt-[40px]" : ""}>
        <Switch>
          {/* Customer Routes */}
          <Route path="/" component={Home} />
          <Route path="/queue/:id" component={QueueStatus} />
          <Route path="/queue/:id/accept" component={Accept} />
          <Route path="/queue/:id/confirmed" component={Confirmed} />
          <Route path="/queue/:id/expired" component={Expired} />

          {/* Admin Routes */}
          <Route path="/admin" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/activity" component={AdminActivity} />

          {/* Fallback */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
