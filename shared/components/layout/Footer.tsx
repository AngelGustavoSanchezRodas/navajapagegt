import { siteConfig } from "@/shared/config/site";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name} por ABA Estudios. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-turquoise transition-colors">
              {siteConfig.email}
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-turquoise transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-turquoise transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-turquoise transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-turquoise transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
