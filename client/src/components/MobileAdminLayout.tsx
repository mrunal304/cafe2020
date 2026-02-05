import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, LayoutDashboard, History, User, Menu, ChevronLeft, X } from "lucide-react";
import { useLogout, useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileAdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { mutate: logout } = useLogout();
  const { data: user } = useUser();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = "/admin";
      }
    });
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
    <div className="flex flex-col min-h-screen bg-[#FDF8F3] md:hidden">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-16 bg-[#8B5A3C] text-white shadow-md">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-[#8B5A3C] border-none text-white">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-8 pb-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="font-serif text-2xl font-normal text-white italic tracking-tight text-left">
                      Admin Panel
                    </SheetTitle>
                  </div>
                </SheetHeader>
                
                <nav className="flex-1 px-4 pt-6">
                  <ul className="space-y-3">
                    {menuItems.map((item) => (
                      <li key={item.title}>
                        <Link href={item.url} onClick={() => setOpen(false)}>
                          <div className={cn(
                            "flex items-center transition-all duration-200 px-4 py-3 h-12 rounded-md border border-transparent cursor-pointer",
                            location === item.url 
                              ? "bg-white/10 border-white/40 text-white font-medium shadow-sm" 
                              : "text-white/80 hover:bg-white/5 hover:text-white"
                          )}>
                            <item.icon className="w-5 h-5 mr-3" />
                            <span className="text-base">{item.title}</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6 mt-auto border-t border-white/10 bg-transparent">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#DCC4B0] flex items-center justify-center border border-white/20">
                        <span className="text-[#8B5A3C] font-bold text-lg">A</span>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-medium text-white leading-none capitalize">{user?.username || "admin"}</span>
                        <span className="text-sm text-white/60 mt-1">Admin</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start text-white border border-white/40 hover:bg-white/10 hover:text-white font-medium h-10 px-6 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="font-serif text-xl font-medium italic">Admin</h1>
        </div>

        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Public Site</span>
          </Button>
        </Link>
      </header>

      {/* Mobile Content */}
      <main className="flex-1 overflow-auto p-4">
        {children}
      </main>
    </div>
  );
}
