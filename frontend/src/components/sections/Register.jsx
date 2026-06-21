import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "../ui/select";
import { WEEKS, PROGRAMME_OPTIONS } from "../../data";

const WORKER_URL = "https://form-handler.gpg210302-account.workers.dev/enquiry";

const COUNTRY_CODES = [
  { code: "+48", label: "PL +48" },
  { code: "+91", label: "IN +91" },
  { code: "+49", label: "DE +49" },
  { code: "+43", label: "AT +43" },
  { code: "+32", label: "BE +32" },
  { code: "+359", label: "BG +359" },
  { code: "+385", label: "HR +385" },
  { code: "+357", label: "CY +357" },
  { code: "+420", label: "CZ +420" },
  { code: "+45", label: "DK +45" },
  { code: "+372", label: "EE +372" },
  { code: "+358", label: "FI +358" },
  { code: "+33", label: "FR +33" },
  { code: "+30", label: "GR +30" },
  { code: "+36", label: "HU +36" },
  { code: "+353", label: "IE +353" },
  { code: "+39", label: "IT +39" },
  { code: "+371", label: "LV +371" },
  { code: "+370", label: "LT +370" },
  { code: "+352", label: "LU +352" },
  { code: "+356", label: "MT +356" },
  { code: "+31", label: "NL +31" },
  { code: "+351", label: "PT +351" },
  { code: "+40", label: "RO +40" },
  { code: "+421", label: "SK +421" },
  { code: "+386", label: "SI +386" },
  { code: "+34", label: "ES +34" },
  { code: "+46", label: "SE +46" },
  { code: "+44", label: "GB +44" },
  { code: "+41", label: "CH +41" },
  { code: "+47", label: "NO +47" },
  { code: "+354", label: "IS +354" },
  { code: "+971", label: "AE +971" },
  { code: "+966", label: "SA +966" },
  { code: "+974", label: "QA +974" },
  { code: "+965", label: "KW +965" },
  { code: "+973", label: "BH +973" },
  { code: "+968", label: "OM +968" },
  { code: "+962", label: "JO +962" },
  { code: "+961", label: "LB +961" },
  { code: "+1",  label: "US +1"  },
  { code: "+1",  label: "CA +1"  },
  { code: "+61", label: "AU +61" },
  { code: "+65", label: "SG +65" },
];

const empty = {
  parent_name: "", email: "", phone: "", child_name: "",
  child_age: "", preferred_week: "", programme_interest: "", message: "",
};

const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition";

const selectCls = "px-2 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition w-24 text-sm";

export const Register = ({ formRef }) => {
  const [form, setForm]               = useState(empty);
  const [loading, setLoading]         = useState(false);
  const [done, setDone]               = useState(false);
  const [countryCode, setCountryCode] = useState("+48");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const resetForm = () => { setForm(empty); setDone(false); setCountryCode("+48"); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.parent_name || !form.email || !form.child_name || !form.child_age || !form.preferred_week || !form.programme_interest) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const fullPhone = form.phone.trim() ? countryCode + " " + form.phone.trim() : "Not provided";
      const payload = new FormData();
      payload.append("parent_name",    form.parent_name);
      payload.append("email",          form.email);
      payload.append("phone",          fullPhone);
      payload.append("child_name",     form.child_name);
      payload.append("child_age",      form.child_age);
      payload.append("preferred_week", form.preferred_week);
      payload.append("programme",      form.programme_interest);
      payload.append("notes",          form.message || "None");
      const res = await fetch(WORKER_URL, { method: "POST", body: payload });
      if (!res.ok) throw new Error("Server error " + res.status);
      setDone(true);
      toast.success("Enquiry received! We will respond within 24 hours.");
    } catch (err) {
      console.error("Enquiry submit failed:", err);
      toast.error("Something went wrong. Please try again or email admin@laneuron.org directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" ref={formRef} className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-0 ln-card overflow-hidden">
          <div className="lg:col-span-2 bg-[#1B2A63] text-white p-8 lg:p-10 flex flex-col">
            <span className="ln-overline !text-[#C7D2FE]">Register / Enquiry</span>
            <h2 className="mt-3 font-display font-extrabold text-3xl md:text-4xl leading-tight">
              Reserve Your Child Spot
            </h2>
            <p className="mt-5 text-white/80 leading-relaxed">
              Spots are limited to a maximum of 10 children per week to ensure every child receives personal attention.
              Submit the form and you will receive a response within 24 hours.
            </p>
            <div className="mt-auto pt-8 space-y-3">
              {["Personal response within 24 hours", "Mention allergies or learning needs", "Sibling discount available"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 size={18} className="text-[#FBBF24]" />
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 p-8 lg:p-10 bg-white">
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-10"
                data-testid="register-success"
              >
                <span className="grid place-items-center w-20 h-20 rounded-full bg-[#10B981] text-white border-2 border-[#0F172A] shadow-[4px_4px_0_#0F172A]">
                  <CheckCircle2 size={40} />
                </span>
                <h3 className="mt-6 font-display font-extrabold text-2xl">Enquiry received!</h3>
                <p className="mt-3 text-[#475569] max-w-sm">
                  Thank you. A personal response from Dr. Priyadarshini will follow within 24 hours.
                </p>
                <button onClick={resetForm} className="ln-btn ln-btn-white mt-7" data-testid="register-another-btn">
                  Submit another enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4" data-testid="register-form">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Parent / guardian full name *">
                    <input className={inputCls} value={form.parent_name} onChange={set("parent_name")} placeholder="Your full name" data-testid="input-parent-name" />
                  </Field>
                  <Field label="Email address *">
                    <input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@email.com" data-testid="input-email" />
                  </Field>
                  <Field label="Phone / WhatsApp (optional)">
                    <div className="flex gap-2">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className={selectCls} data-testid="select-country-code">
                        {COUNTRY_CODES.map(({ code, label }) => (
                          <option key={code} value={code}>{label}</option>
                        ))}
                      </select>
                      <input className={inputCls + " flex-1"} value={form.phone} onChange={set("phone")} placeholder=" " data-testid="input-phone" />
                    </div>
                  </Field>
                  <Field label="Child first name *">
                    <input className={inputCls} value={form.child_name} onChange={set("child_name")} placeholder="Child name" data-testid="input-child-name" />
                  </Field>
                  <Field label="Child age (6-13) *">
                    <input type="number" min="6" max="13" className={inputCls} value={form.child_age} onChange={set("child_age")} placeholder="e.g. 9" data-testid="input-child-age" />
                  </Field>
                  <Field label="Preferred week *">
                    <Select value={form.preferred_week} onValueChange={(v) => setForm((f) => ({ ...f, preferred_week: v }))}>
                      <SelectTrigger className={inputCls + " h-auto"} data-testid="select-week">
                        <SelectValue placeholder="Choose a week" />
                      </SelectTrigger>
                      <SelectContent>
                        {WEEKS.map((w) => (
                          <SelectItem key={w} value={w} data-testid={"week-" + w}>{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label="Programme interest *">
                  <Select value={form.programme_interest} onValueChange={(v) => setForm((f) => ({ ...f, programme_interest: v }))}>
                    <SelectTrigger className={inputCls + " h-auto"} data-testid="select-programme">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMME_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p} data-testid={"prog-" + p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Questions, allergies, or learning needs (optional)">
                  <textarea rows={3} className={inputCls + " resize-none"} value={form.message} onChange={set("message")} placeholder="Anything the educator should know" data-testid="input-message" />
                </Field>
                <button type="submit" disabled={loading} className="ln-btn ln-btn-primary w-full" data-testid="register-submit-btn">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <>Submit Enquiry <Send size={18} /></>}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-[#475569] font-medium">
                  <ShieldCheck size={14} /> Your details are kept private and used only to respond to your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-sm font-bold mb-1.5">{label}</span>
    {children}
  </label>
);