import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { SITE, NAV } from "../../data";
import logo from "../../assets/logo.png";

const FACTS = ["Ages 6–13", "Mon–Fri 9AM–12PM", "Max 10 per week", "Starts 6 July 2026", "Kraków"];

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative z-10 bg-[#0F172A] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="inline-flex bg-white rounded-2xl p-3 border-2 border-white/15">
              <img src={logo} alt="La Neuron – STEAM Academy" className="h-16 w-auto" />
            </div>
            <p className="mt-4 text-white/60 max-w-md leading-relaxed">
              Hands-on STEAM education for children aged 6–13. Led by a PhD Cognitive Scientist and certified
              Neuroscience Coach. Every child deserves to experience the wonder of discovery.
            </p>
            <div className="mt-5 flex gap-3">
              <a href={SITE.social.facebook} aria-label="Facebook" data-testid="social-facebook" className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-[#1B2A63] transition-colors">
                <Facebook size={18} />
              </a>
              <a href={SITE.social.instagram} aria-label="Instagram" data-testid="social-instagram" className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-[#E0B33C] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-extrabold mb-4">Explore</h4>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.path}>
                  <button onClick={() => navigate(n.path)} className="text-white/60 hover:text-white transition-colors text-sm">
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-extrabold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-[#E0B33C]" /> {SITE.venue}</li>
              <li><a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-white"><Phone size={16} className="text-[#10B981]" /> {SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-white break-all"><Mail size={16} className="text-[#FBBF24]" /> {SITE.email}</a></li>
            </ul>
            <button onClick={() => navigate("/register")} className="ln-btn ln-btn-enquire font-mono tracking-wide">Enquire Now</button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2 justify-center">
          {FACTS.map((f) => (
            <span key={f} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 text-white/80">{f}</span>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
          <p className="text-xs text-white/50">© 2026 {SITE.brand}, Kraków. All rights reserved.</p>
          <p className="text-xs text-white/50">Dr. Priyadarshini Gouthaman • {SITE.phone}</p>
        </div>
      </div>
    </footer>
  );
};