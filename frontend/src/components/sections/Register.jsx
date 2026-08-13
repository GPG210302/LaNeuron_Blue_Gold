import { useState } from "react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../i18n/useData";

const WORKER_URL = "https://form-handler.gpg210302-account.workers.dev/enquiry";

const COUNTRY_CODES = [
  { code: "+48", label: "PL +48" }, { code: "+91", label: "IN +91" },
  { code: "+49", label: "DE +49" }, { code: "+43", label: "AT +43" },
  { code: "+32", label: "BE +32" }, { code: "+33", label: "FR +33" },
  { code: "+39", label: "IT +39" }, { code: "+31", label: "NL +31" },
  { code: "+34", label: "ES +34" }, { code: "+44", label: "GB +44" },
  { code: "+1", label: "US +1" }, { code: "+61", label: "AU +61" },
];

const empty = {
  programme_interest: "", parent_name: "", email: "", phone: "", child_name: "", child_age: "",
  start_date: "", end_date: "", preferred_contact: [], message: "", support_areas: [],
  session_pattern: "", learning_situation: "", research_experience: "",
  research_experience_description: "", english_reading_comfort: "", weekly_availability: "",
  project_style: [], research_interests: "", institution_name: "", institution_type: "",
  institution_type_other: "", contact_role: "", student_count: "", student_age_range: "",
  collaboration_types: [], delivery_languages: [], proposed_timeline: "", collaboration_goals: "",
};

const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium placeholder:text-[#94A3B8] focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition";
const countryCls = "w-24 px-2 py-3 rounded-xl border-2 border-[#0F172A] bg-white text-[#0F172A] font-medium focus:outline-none focus:ring-4 focus:ring-[#E0B33C]/40 transition text-sm";

const standardProgrammes = ["thematic", "cyclic", "single-day", "not-sure"];
const needsDates = ["thematic", "cyclic", "single-day"];
const VALID_PROGRAMMES = [
  "thematic", "cyclic", "single-day", "not-sure",
  "cognitive", "research", "collaboration",
];
export const Register = ({ formRef }) => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(() => {
      const requested = searchParams.get("programme");
      return {
        ...empty,
        programme_interest: VALID_PROGRAMMES.includes(requested) ? requested : "",
      };
    });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [countryCode, setCountryCode] = useState("+48");
  const { register } = useData();
  const t = register.form;
  const todayStr = new Date().toISOString().slice(0, 10);
  const programme = form.programme_interest;
  const isStandard = standardProgrammes.includes(programme);
  const isCognitive = programme === "cognitive";
  const isResearch = programme === "research";
  const isCollaboration = programme === "collaboration";

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const setProgramme = (event) => {
    const programmeId = event.target.value;
    setForm((current) => ({
      ...empty,
      programme_interest: programmeId,
      parent_name: current.parent_name,
      email: current.email,
      phone: current.phone,
      preferred_contact: current.preferred_contact,
    }));
  };

  const toggle = (key, value) => (event) => {
    setForm((current) => {
      const currentValues = current[key] || [];
      return {
        ...current,
        [key]: event.target.checked
          ? [...new Set([...currentValues, value])]
          : currentValues.filter((item) => item !== value),
      };
    });
  };

  const handleContactChange = (event) => {
    const { value, checked } = event.target;
    setForm((current) => ({
      ...current,
      preferred_contact: checked
        ? [...new Set([...current.preferred_contact, value])]
        : current.preferred_contact.filter((item) => item !== value),
    }));
  };

  const handleDate = (key) => (event) => {
    const value = event.target.value;
    if (!value) {
      setForm((current) => ({ ...current, [key]: "" }));
      return;
    }
    const selected = new Date(`${value}T00:00:00`);
    if (selected < new Date(`${todayStr}T00:00:00`)) {
      toast.error(t.validation.futureDate);
      return;
    }
    if (selected.getDay() === 0) {
      toast.error(t.validation.noSunday);
      return;
    }
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "start_date" && current.end_date && new Date(`${current.end_date}T00:00:00`) < selected) next.end_date = value;
      if (key === "end_date" && current.start_date && selected < new Date(`${current.start_date}T00:00:00`)) {
        toast.error(t.validation.endBeforeStart);
        next.end_date = current.start_date;
      }
      return next;
    });
  };

  const validationMessage = () => {
    if (!programme) return t.validation.programme;
    if (!form.parent_name) return isCollaboration ? t.validation.contactName : t.validation.parentName;
    if (!form.email) return t.validation.email;
    if (!form.preferred_contact.length) return t.validation.contactMethod;

    if (isStandard) {
      if (!form.child_name) return t.validation.childName;
      if (!form.child_age) return t.validation.childAge;
      if (needsDates.includes(programme) && !form.start_date) return t.validation.startDate;
      if (needsDates.includes(programme) && !form.end_date) return t.validation.endDate;
    }
    if (isCognitive) {
      if (!form.child_name) return t.validation.childName;
      if (!form.child_age) return t.validation.childAge;
      if (!form.support_areas.length) return t.validation.supportArea;
      if (!form.session_pattern) return t.validation.sessionPattern;
    }
    if (isResearch) {
      if (!form.child_name) return t.validation.studentName;
      if (!form.child_age) return t.validation.studentAge;
      if (!form.weekly_availability) return t.validation.weeklyTime;
    }
    if (isCollaboration) {
      if (!form.institution_name) return t.validation.institutionName;
      if (!form.institution_type) return t.validation.institutionType;
      if (form.institution_type === "other" && !form.institution_type_other.trim()) return t.validation.institutionOther;
      if (!form.contact_role) return t.validation.contactRole;
      if (!form.student_age_range) return t.validation.studentAgeRange;
      if (!form.collaboration_types.length) return t.validation.collaborationType;
    }
    return "";
  };

  const append = (payload, key, value) => payload.append(
    key,
    Array.isArray(value) ? value.join(", ") || "Not provided" : String(value || "").trim() || "Not provided"
  );

  const submit = async (event) => {
    event.preventDefault();
    const error = validationMessage();
    if (error) return toast.error(error);
    setLoading(true);
    try {
      const payload = new FormData();
      const phone = form.phone.trim() ? `${countryCode} ${form.phone.trim()}` : "Not provided";
      const programmeLabel = t.programmes.find((item) => item.id === programme)?.label || programme;
      append(payload, "parent_name", form.parent_name);
      append(payload, "email", form.email);
      append(payload, "phone", phone);
      append(payload, "programme", programmeLabel);
      append(payload, "programme_id", programme);
      append(payload, "preferred_contact", form.preferred_contact);
      append(payload, "notes", form.message);
      Object.entries(form).forEach(([key, value]) => {
        if (!["parent_name", "email", "phone", "programme_interest", "preferred_contact", "message"].includes(key)) append(payload, key, value);
      });
      const response = await fetch(WORKER_URL, { method: "POST", body: payload });
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "conversion", { send_to: "AW-18273296037/z6F0CK7tksscEKW9sYlE" });
      }
      setDone(true);
      toast.success(register.successHeading);
    } catch (error) {
      console.error("Enquiry submit failed:", error);
      toast.error(register.errorGeneral);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(empty);
    setCountryCode("+48");
    setDone(false);
  };

  return (
    <section id="register" ref={formRef} className="py-20 lg:py-28 pt-28 sm:pt-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.88fr,1.32fr] overflow-hidden rounded-[2rem] border-2 border-[#0F172A] shadow-[8px_8px_0_#0F172A]">
          <div className="bg-[#1E2F6D] text-white p-8 sm:p-10 lg:p-11 flex flex-col">
            <p className="text-xs font-extrabold tracking-[0.24em] text-[#D7DEFF] uppercase">{register.overline}</p>
            <h1 className="mt-5 font-display font-extrabold text-3xl sm:text-4xl leading-tight text-[#FBBF24]">{register.heading}</h1>
            <p className="mt-6 text-[#F1F5FF] leading-relaxed">{register.subtext}</p>
            <div className="mt-auto pt-12 space-y-4">
              {(register.promises || []).map((item) => <div key={item} className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-5 h-5 shrink-0 text-[#FBBF24]" /><span>{item}</span></div>)}
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 lg:p-10">
            {done ? (
              <div className="min-h-[520px] flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <h2 className="mt-5 font-display font-extrabold text-3xl text-[#0F172A]">{register.successHeading}</h2>
                <p className="mt-3 max-w-md text-[#475569] leading-relaxed">{register.successText}</p>
                <button type="button" onClick={resetForm} className="mt-8 px-6 py-3 rounded-full bg-[#FBBF24] border-2 border-[#0F172A] font-bold text-[#0F172A] shadow-[3px_3px_0_#0F172A]">{register.successBtn}</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6">
                <Field label={t.labels.programmeInterest}>
                  <select value={programme} onChange={setProgramme} className={inputCls}>
                    <option value="">{t.placeholders.programme}</option>
                    {t.programmes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                  <Tip text={t.tips.programme} />
                </Field>

                {programme && <>
                  {isCollaboration ? (
                    <CollaborationFields form={form} t={t} set={set} toggle={toggle} countryCode={countryCode} setCountryCode={setCountryCode} />
                  ) : (
                    <StudentFields form={form} t={t} set={set} countryCode={countryCode} setCountryCode={setCountryCode} research={isResearch} />
                  )}

                  {needsDates.includes(programme) && <DateFields form={form} t={t} todayStr={todayStr} handleDate={handleDate} />}
                  {isCognitive && <CognitiveFields form={form} t={t} set={set} toggle={toggle} />}
                  {isResearch && <ResearchFields form={form} t={t} set={set} toggle={toggle} />}

                  <Field label={t.labels.preferredContact}>
                    <div className="grid grid-cols-2 gap-3">
                      {t.contactMethods.map((item) => <CheckOption key={item} label={item} value={item} checked={form.preferred_contact.includes(item)} onChange={handleContactChange} />)}
                    </div>
                  </Field>

                  <Field label={isCollaboration ? t.labels.collaborationNotes : isResearch ? t.labels.researchNotes : t.labels.notes}>
                    <textarea value={form.message} onChange={set("message")} className={`${inputCls} min-h-32 resize-y`} placeholder={isCollaboration ? t.placeholders.collaborationNotes : isResearch ? t.placeholders.researchNotes : t.placeholders.notes} />
                  </Field>

                  <button type="submit" disabled={loading} className="w-full inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-[#FCE48A] via-[#FBBF24] to-[#FCE48A] border-2 border-[#0F172A] text-[#0F172A] font-extrabold shadow-[4px_4px_0_#0F172A] disabled:opacity-60">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" />{register.sending}</> : <>{register.submit}<Send className="w-5 h-5" /></>}
                  </button>
                  <p className="flex items-center justify-center gap-2 text-xs text-[#64748B] text-center"><ShieldCheck className="w-4 h-4" />{register.privacy}</p>
                </>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function StudentFields({ form, t, set, countryCode, setCountryCode, research }) {
  return <div className="grid sm:grid-cols-2 gap-5">
    <Field label={t.labels.parentName}><input value={form.parent_name} onChange={set("parent_name")} className={inputCls} placeholder={t.placeholders.parentName} /></Field>
    <Field label={t.labels.email}><input type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder={t.placeholders.email} /></Field>
    <Field label={t.labels.phone}><div className="flex gap-2"><select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} className={countryCls}>{COUNTRY_CODES.map(({ code, label }, index) => <option key={`${label}-${index}`} value={code}>{label}</option>)}</select><input value={form.phone} onChange={set("phone")} className={inputCls} placeholder={t.placeholders.phone} /></div></Field>
    <Field label={research ? t.labels.studentName : t.labels.childName}><input value={form.child_name} onChange={set("child_name")} className={inputCls} placeholder={research ? t.placeholders.studentName : t.placeholders.childName} /></Field>
    <Field label={research ? t.labels.studentAge : t.labels.childAge}><input type="number" min={research ? "13" : "6"} max={research ? "18" : "14"} value={form.child_age} onChange={set("child_age")} className={inputCls} placeholder={research ? "np. 15" : t.placeholders.childAge} /></Field>
  </div>;
}

function DateFields({ form, t, todayStr, handleDate }) {
  return <div className="grid sm:grid-cols-2 gap-5">
    <Field label={t.labels.startDate}><input type="date" value={form.start_date} min={todayStr} onChange={handleDate("start_date")} className={inputCls} /><Tip text={t.tips.startDate} /></Field>
    <Field label={t.labels.endDate}><input type="date" value={form.end_date} min={form.start_date || todayStr} onChange={handleDate("end_date")} className={inputCls} /><Tip text={t.tips.endDate} /></Field>
  </div>;
}

function CognitiveFields({ form, t, set, toggle }) {
  return <div className="space-y-5">
    <Field label={t.labels.supportAreas}><div className="grid sm:grid-cols-2 gap-3">{t.supportAreas.map((item) => <CheckOption key={item} label={item} checked={form.support_areas.includes(item)} onChange={toggle("support_areas", item)} />)}</div><Tip text={t.tips.supportAreas} /></Field>
    <Field label={t.labels.sessionPattern}><select value={form.session_pattern} onChange={set("session_pattern")} className={inputCls}><option value="">{t.placeholders.select}</option>{t.sessionPatterns.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
    <Field label={t.labels.learningSituation}><textarea value={form.learning_situation} onChange={set("learning_situation")} className={`${inputCls} min-h-28 resize-y`} placeholder={t.placeholders.learningSituation} /></Field>
  </div>;
}

function ResearchFields({ form, t, set, toggle }) {
  return <div className="space-y-5">
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label={t.labels.researchExperience}><div className="flex flex-wrap gap-5 pt-3">{t.yesNo.map((item) => <RadioOption key={item} name="research_experience" label={item} checked={form.research_experience === item} onChange={() => set("research_experience")({ target: { value: item } })} />)}</div><Tip text={t.tips.researchExperience} /></Field>
      <Field label={t.labels.englishComfort}><select value={form.english_reading_comfort} onChange={set("english_reading_comfort")} className={inputCls}><option value="">{t.placeholders.select}</option>{t.englishComfortOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
    </div>
    {form.research_experience === t.yesNo[0] && <Field label={t.labels.researchDescription}><textarea value={form.research_experience_description} onChange={set("research_experience_description")} className={`${inputCls} min-h-28 resize-y`} placeholder={t.placeholders.researchDescription} /></Field>}
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label={t.labels.weeklyTime}><select value={form.weekly_availability} onChange={set("weekly_availability")} className={inputCls}><option value="">{t.placeholders.select}</option>{t.weeklyTimeOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select><Tip text={t.tips.weeklyTime} /></Field>
      <Field label={t.labels.projectStyle}><div className="space-y-3 pt-2">{t.projectStyles.map((item) => <CheckOption key={item} label={item} checked={form.project_style.includes(item)} onChange={toggle("project_style", item)} />)}</div></Field>
    </div>
    <Field label={t.labels.researchInterests}><textarea value={form.research_interests} onChange={set("research_interests")} className={`${inputCls} min-h-24 resize-y`} placeholder={t.placeholders.researchInterests} /></Field>
  </div>;
}

function CollaborationFields({ form, t, set, toggle, countryCode, setCountryCode }) {
  return <div className="space-y-5">
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label={t.labels.contactName}><input value={form.parent_name} onChange={set("parent_name")} className={inputCls} placeholder={t.placeholders.contactName} /></Field>
      <Field label={t.labels.workEmail}><input type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder={t.placeholders.workEmail} /></Field>
      <Field label={t.labels.phone}><div className="flex gap-2"><select value={countryCode} onChange={(event) => setCountryCode(event.target.value)} className={countryCls}>{COUNTRY_CODES.map(({ code, label }, index) => <option key={`${label}-${index}`} value={code}>{label}</option>)}</select><input value={form.phone} onChange={set("phone")} className={inputCls} placeholder={t.placeholders.phone} /></div></Field>
      <Field label={t.labels.institutionName}><input value={form.institution_name} onChange={set("institution_name")} className={inputCls} placeholder={t.placeholders.institutionName} /></Field>
      <Field label={t.labels.institutionType}><select value={form.institution_type} onChange={set("institution_type")} className={inputCls}><option value="">{t.placeholders.select}</option>{t.institutionTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></Field>
      <Field label={t.labels.contactRole}><select value={form.contact_role} onChange={set("contact_role")} className={inputCls}><option value="">{t.placeholders.select}</option>{t.contactRoles.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
      {form.institution_type === "other" && <Field label={t.labels.institutionOther}><input value={form.institution_type_other} onChange={set("institution_type_other")} className={inputCls} placeholder={t.placeholders.institutionOther} /></Field>}
      <Field label={t.labels.studentCount}><input value={form.student_count} onChange={set("student_count")} className={inputCls} placeholder={t.placeholders.studentCount} /></Field>
      <Field label={t.labels.studentAgeRange}><input value={form.student_age_range} onChange={set("student_age_range")} className={inputCls} placeholder={t.placeholders.studentAgeRange} /></Field>
      <Field label={t.labels.timeline}><input value={form.proposed_timeline} onChange={set("proposed_timeline")} className={inputCls} placeholder={t.placeholders.timeline} /><Tip text={t.tips.timeline} /></Field>
    </div>
    <Field label={t.labels.collaborationTypes}><div className="grid sm:grid-cols-2 gap-3">{t.collaborationTypes.map((item) => <CheckOption key={item} label={item} checked={form.collaboration_types.includes(item)} onChange={toggle("collaboration_types", item)} />)}</div></Field>
    <Field label={t.labels.deliveryLanguages}><div className="grid sm:grid-cols-3 gap-3">{t.deliveryLanguages.map((item) => <CheckOption key={item} label={item} checked={form.delivery_languages.includes(item)} onChange={toggle("delivery_languages", item)} />)}</div></Field>
    <Field label={t.labels.collaborationGoals}><textarea value={form.collaboration_goals} onChange={set("collaboration_goals")} className={`${inputCls} min-h-28 resize-y`} placeholder={t.placeholders.collaborationGoals} /></Field>
    <div className="rounded-xl border border-[#C8D2F4] bg-[#EFF3FF] p-4 text-sm text-[#263A7A] leading-relaxed"><strong>{t.goalsNote.title}</strong> {t.goalsNote.text}</div>
  </div>;
}

function Field({ label, children }) { return <label className="block text-sm font-bold text-[#0F172A]"><span className="block mb-2">{label}</span>{children}</label>; }
function Tip({ text }) { return <p className="mt-2 text-xs text-[#64748B] font-normal">{text}</p>; }
function CheckOption({ label, checked, onChange, value }) { return <label className="flex items-start gap-2 text-sm font-medium text-[#0F172A] cursor-pointer"><input type="checkbox" value={value || label} checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 rounded border-[#0F172A] accent-[#1E2F6D]" /><span>{label}</span></label>; }
function RadioOption({ name, label, checked, onChange }) { return <label className="flex items-center gap-2 text-sm font-medium text-[#0F172A] cursor-pointer"><input type="radio" name={name} value={label} checked={checked} onChange={onChange} className="h-4 w-4 border-[#0F172A] accent-[#1E2F6D]" /><span>{label}</span></label>; }