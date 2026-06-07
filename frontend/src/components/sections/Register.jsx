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
  { code: "+48", flag: "🇵🇱", label: "PL" },
  { code: "+91", flag: "🇮🇳", label: "IN" },
  { code: "+44", flag: "🇬🇧", label: "GB" },
  { code: "+1",  flag: "🇺🇸", label: "US" },
  { code: "+49", flag: "🇩🇪", label: "DE" },
  { code: "+31", flag: "🇳🇱", label: "NL" },
  { code: "+33", flag: "🇫🇷", label: "FR" },
  { code: "+39", flag: "🇮🇹", label: "IT" },
  { code: "+34", flag: "🇪🇸", label: "ES" },
  { code: "+61", flag: "🇦🇺", label: "AU" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+65", flag: "🇸🇬", label: "SG" },
];

const empty = {
  parent_name: "", email: "", phone: "", child_name: "",
  child_age: "", preferred_week: "", programme_interest: "", message: "",
};

const inputCls =
  "w-full px-4 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition";

export const Register = ({ formRef }) => {
  const [form, setForm]           = useState(empty);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [countryCode, setCountryCode] = useState("+48"); // Default: Poland

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.parent_name || !form.email || !form.child_name || !form.child_age || !form.preferred_week || !form.programme_interest) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Combine country code + number only if a number was entered
      const fullPhone = form.phone.trim()
        ? `${countryCode} ${form.phone.trim()}`
        : "Not provided";

      const payload = new FormData();
      payload.append("parent_name",    form.parent_name);
      payload.append("email",          form.email);
      payload.append("phone",          fullPhone);
      payload.append("child_name",     form.child_name);
      payload.append("child_age",      form.child_age);
      payload.append("preferred_week", form.preferred_week);
      payload.append("programme",      form.programme_interest);
      payload.append("notes",          form.message || "None");

      const res = await fetch(WORKER_URL, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      setDone(true);
      toast.success("Enquiry received! We'll respond within 24 hours.");

    } catch (err) {
      console.error("Enquiry submit failed:", err);
      toast.error("Something went wrong. Please try again or email admin@la-neuron.org directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="register" ref={formRef} className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-0 ln-card overflow-hidden">

          {/* Left intro */}
          <div className="lg:col-span-2 bg-[#1B2A63] text-white p-8 lg:p-10 flex flex-col">
            <span className="ln-overline !text-[#C7D2FE]">Register / Enquiry</span>
            <h2 className="mt-3 font-display font-extrabold text-3xl md:text-4xl leading-tight">
              Reserve Your Child's Spot
            </h2>
            <p className="mt-5 text-white/80 leading-relaxed">
              Spots are limited to a maximum of 10 children per week to ensure every child receives personal attention.
              Submit the form and you'll receive a response within 24 hours.
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

          {/* Right form */}
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
                <button
                  onClick={() => { setForm(empty); setDone(false); setCountryCode("+48"); }}
                  className="ln-btn ln-btn-white mt-7"
                  data-testid="register-another-btn"
                >
                  Submit another enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-4" data-testid="register-form">
                <div className="grid sm:grid-cols-2 gap-4">

                  <Field label="Parent / guardian full name *">
                    <input
                      className={inputCls}
                      value={form.parent_name}
                      onChange={set("parent_name")}
                      placeholder="Your full name"
                      data-testid="input-parent-name"
                    />
                  </Field>

                  <Field label="Email address *">
                    <input
                      type="email"
                      className={inputCls}
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@email.com"
                      data-testid="input-email"
                    />
                  </Field>

                  {/* ── Phone with country code picker ── */}
                  <Field label="Phone / WhatsApp (optional)">
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition w-24 text-sm"
                        data-testid="select-country-code"
                      >
                        {COUNTRY_CODES.map(({ code, flag, label }) => (
                          <option key={code} value={code}>
                            {flag} {code}
                          </option>
                        ))}
                      </select>
                      <input
                        className={inputCls + " flex-1"}
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="729 655 422"
                        data-testid="input-phone"
                      />
                    </div>
                  </Field>

                  <Field label="Child's first name *">
                    <input
                      className={inputCls}
                      value={form.child_name}
                      onChange={set("child_name")}
                      placeholder="Child's name"
                      data-testid="input-child-name"
                    />
                  </Field>

                  <Field label="Child's age (6–13) *">
                    <input
                      type="number"
                      min="6"
                      max="13"
                      className={inputCls}
                      value={form.child_age}
                      onChange={set("child_age")}
                      placeholder="e.g. 9"
                      data-testid="input-child-age"
                    />
                  </Field>

                  <Field label="Preferred week *">
                    <Select value={form.preferred_week} onValueChange={(v) => setForm((f) => ({ ...f, preferred_week: v }))}>
                      <SelectTrigger className={inputCls + " h-auto"} data-testid="select-week">
                        <SelectValue placeholder="Choose a week" />
                      </SelectTrigger>
                      <SelectContent>
                        {WEEKS.map((w) => (
                          <SelectItem key={w} value={w} data-testid={`week-${w}`}>{w}</SelectItem>
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
                        <SelectItem key={p} value={p} data-testid={`prog-${p}`}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

              