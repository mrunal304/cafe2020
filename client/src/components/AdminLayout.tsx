import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, LayoutDashboard, History, User } from "lucide-react";
import { useLogout, useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/logo_transparent.png";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { mutate: logout } = useLogout();
  const { data: user } = useUser();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = "/admin";
      }
    });
  };

  const style = {
    "--sidebar-background": "30 60% 22%", // #5C3317 (Dark Brown)
    "--sidebar-foreground": "60 40% 98%", // #FFFFFF (White/Light Cream)
    "--sidebar-primary": "60 40% 98%",
    "--sidebar-primary-foreground": "30 60% 22%",
    "--sidebar-accent": "36 31% 41%", // #8B6B47 (Medium Brown for Selected)
    "--sidebar-accent-foreground": "0 0% 100%", // White
    "--sidebar-border": "30 50% 32%", // #4A2810 (Slightly darker brown)
    "--sidebar-ring": "30 60% 22%",
    "--sidebar-width": "16rem",
  };

  const menuItems = [
    {
      title: "Active Queue",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Recent Activity",
      url: "/admin/activity",
      icon: History,
    },
  ];

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-svh w-full overflow-hidden bg-[#F5F5DC]">
        <Sidebar className="border-none">
          <SidebarHeader className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="h-8 w-auto brightness-0 invert" />
              <span className="font-sans text-2xl font-bold text-white tracking-tight">Admin Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 pt-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title} className="mb-2">
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url}
                        className={cn(
                          "transition-all duration-200 px-5 py-3 h-11 rounded-lg",
                          location === item.url 
                            ? "bg-[#8B6B47] text-white font-semibold" 
                            : "bg-transparent text-[#E8DCC4] hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className={cn("w-5 h-5", location === item.url ? "text-white" : "text-[#E8DCC4]")} />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-0 border-t border-white/15 bg-[#4A2810]">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white leading-none capitalize">{user?.username || "admin"}</span>
                  <span className="text-sm text-[#C4B5A0] mt-1">Admin</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-white border border-white/30 hover:bg-[#8B6B47] hover:text-white font-bold h-11 px-4 rounded-md"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
