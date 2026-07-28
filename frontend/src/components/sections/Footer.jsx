import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { SITE } from "../../data";
import { useData } from "../../i18n/useData";
import logo from "../../assets/logo.png";

export const Footer = () => {
  const navigate = useNavigate();
  const { nav, footer } = useData();

  const footerLinks = [
    { label: nav.home, path: "/" },
    { label: nav.about, path: "/about" },
    { label: nav.steam, path: "/steam" },
    { label: nav.workshops, path: "/workshops" },
    { label: nav.gallery, path: "/gallery" },
    { label: nav.documents, path: "/documents" },
  ];

  return (
    <footer className="relative z-10 bg-[#0F172A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="inline-flex bg-white rounded-2xl p-3 border-2 border-white/15">
              <img src={logo} alt="La Neuron – STEAM Academy" className="h-16 w-auto" />
            </div>

            <p className="mt-4 text-white/60 max-w-md leading-relaxed">
              {footer.description}
            </p>

            <div className="mt-5 flex gap-3">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-testid="social-facebook"
                className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-[#1B2A63] transition-colors"
              >
                <Facebook size={18} />
              </a>

              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-testid="social-instagram"
                className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E0B33C] transition-colors"
              >
                <Instagram size={18} />
              </a>

              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                data-testid="social-linkedin"
                className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-[#1B2A63] transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-extrabold mb-4 text-[#F5A623]">
              {footer.exploreTitle}
            </h4>

            <ul className="space-y-2">
              {footerLinks.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-extrabold mb-4 text-[#F5A623]">
              {footer.contactTitle}
            </h4>

            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#E0B33C]" />
                {SITE.venue}
              </li>

              <li>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-white">
                  <Phone size={16} className="text-[#10B981]" />
                  {SITE.phone}
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2 hover:text-white break-all"
                >
                  <Mail size={16} className="text-[#FBBF24]" />
                  {SITE.email}
                </a>
              </li>
            </ul>

            <button
              onClick={() => navigate("/register")}
              className="ln-btn ln-btn-primary mt-5 !px-5 !py-2.5 !text-sm"
              data-testid="footer-enquire-btn"
            >
              {footer.enquireBtn}
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2 justify-center">
          {footer.facts.map((f) => (
            <span
              key={f}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 text-white/80"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center md:items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs text-white/50">
            © 2026 {SITE.brand}. {footer.copyright}
          </p>

          <p className="text-xs text-white/45 md:text-right">
            Website crafted by{" "}
            <span className="text-white/70 font-medium">G3 Creative Labs</span>
            {" "}· Ghavish V G ·{" "}
            <a
              href="tel:+48579156009"
              className="text-white/70 hover:text-[#E0B33C] transition-colors"
            >
              +48 579 156 009
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};