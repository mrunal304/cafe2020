import { ReactNode } from "react";
import logoUrl from "@assets/logo_transparent.png";

export function CustomerLayout({ children, hideLogo = false }: { children: ReactNode, hideLogo?: boolean }) {
  return (
    <div className="min-h-screen bg-[#F5E6D3] relative overflow-x-hidden flex flex-col items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-orange-100/50 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-md z-10 h-full flex flex-col py-2 overflow-hidden">
        {/* Logo Header */}
        {!hideLogo && (
          <div className="flex flex-col items-center mb-6 flex-shrink-0">
            <div className="w-32 transition-transform duration-300">
              <img 
                src={logoUrl} 
                alt="Made in 2020 Logo" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className={`glass-card rounded-3xl ${hideLogo ? 'p-3' : 'p-6 md:p-8'} shadow-2xl ring-1 ring-black/5 flex-1 mb-16 overflow-visible`}>
          {children}
        </div>

        {/* Footer */}
        {!hideLogo && (
          <p className="text-center text-stone-400 font-bold text-[10px] mt-4 uppercase tracking-widest opacity-60 flex-shrink-0 pb-safe">
            &copy; {new Date().getFullYear()} Cafe 2020. Powered by ReserveGo
          </p>
        )}
      </div>
    </div>
  );
}
