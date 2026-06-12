import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API } from "@/lib/constants";
import { Overline } from "@/components/sections/Problem";
import { Send, Mail, Phone, User, Users, MessageSquare } from "lucide-react";

const emptyForm = { name: "", email: "", phone: "", crew_size: "", message: "", site_ref: "" };

export default function LeadForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    const phone = form.phone.trim();
    if (phone && !/^[0-9+\-\s().]{7,20}$/.test(phone))
      return "Please enter a valid phone number (digits only, 7\u201320 characters).";
    if (!form.message.trim() || form.message.trim().length < 5) return "Please add a short message.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        crew_size: form.crew_size.trim() || null,
        message: form.message.trim(),
        site_ref: form.site_ref || null,
      };
      const { data } = await axios.post(`${API}/leads`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });
      setForm(emptyForm);
      // Meta Pixel — fire Lead conversion at the moment of successful submit.
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead", {
          value: 99,
          currency: "USD",
          content_name: "Main Site Lead Form",
        });
      }
      // Hard navigate to /thank-you so conversion pixels & ad-platform
      // URL-based goals can fire on a real, distinct page view.
      const leadId = data?.id ? `?lead_id=${encodeURIComponent(data.id)}` : "";
      navigate(`/thank-you${leadId}`);
    } catch (e2) {
      const msg =
        e2?.response?.status === 429
          ? "Too many requests. Please wait a minute and try again."
          : "Couldn't send right now. Try again shortly.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-testid="lead-form-section" className="relative py-24 sm:py-32 bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
        {/* Left copy */}
        <div className="lg:col-span-5 space-y-6">
          <Overline>13 · Questions?</Overline>
          <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-ink leading-[0.95]">
            Fit, volume pricing, <br />
            crew rollout — <span className="text-muk">ask.</span>
          </h2>
          <p className="text-lg text-ink/70 max-w-md">
            Have a question before you order? Send it over. A real human gets
            back to you — not a bot, not a call center.
          </p>
          <ul className="pt-4 space-y-3 text-ink/80">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-slime" /> Fleet & crew pricing</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-slime" /> Vacuum fit & compatibility</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-slime" /> Bulk orders for GCs</li>
          </ul>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <form
            data-testid="lead-form"
            onSubmit={onSubmit}
            className="bg-white border border-ink/30 p-6 sm:p-10"
            noValidate
          >
            {/* Honeypot */}
            <input
              type="text"
              name="site_ref"
              value={form.site_ref}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px" }}
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Field icon={<User className="w-4 h-4" />} label="Name" name="name" required>
                <input
                  data-testid="lead-name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  maxLength={80}
                  required
                  className="w-full bg-cream border border-ink/20 text-ink px-4 py-3 outline-none focus:border-slime transition-colors"
                />
              </Field>
              <Field icon={<Mail className="w-4 h-4" />} label="Email" name="email" required>
                <input
                  data-testid="lead-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  maxLength={120}
                  required
                  className="w-full bg-cream border border-ink/20 text-ink px-4 py-3 outline-none focus:border-slime transition-colors"
                />
              </Field>
              <Field icon={<Phone className="w-4 h-4" />} label="Phone" name="phone" optional>
                <input
                  data-testid="lead-phone"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  maxLength={25}
                  className="w-full bg-cream border border-ink/20 text-ink px-4 py-3 outline-none focus:border-slime transition-colors"
                />
              </Field>
              <Field icon={<Users className="w-4 h-4" />} label="Crew Size" name="crew_size" optional>
                <select
                  data-testid="lead-crew"
                  name="crew_size"
                  value={form.crew_size}
                  onChange={onChange}
                  className="w-full bg-cream border border-ink/20 text-ink px-4 py-3 outline-none focus:border-slime transition-colors"
                >
                  <option value="">Select</option>
                  <option>1 crew</option>
                  <option>2-4 crews</option>
                  <option>5-9 crews</option>
                  <option>10+ crews</option>
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <Field icon={<MessageSquare className="w-4 h-4" />} label="Message" name="message" required>
                <textarea
                  data-testid="lead-message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={onChange}
                  maxLength={2000}
                  required
                  className="w-full bg-cream border border-ink/20 text-ink px-4 py-3 outline-none focus:border-slime transition-colors resize-none"
                  placeholder="What do you want to know?"
                />
              </Field>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-ink/50 max-w-sm">
                By submitting, you agree to be contacted about Muk Buddy. We
                don't share or sell your info.
              </p>
              <button
                type="submit"
                disabled={submitting}
                data-testid="lead-submit"
                className="sticker-btn inline-flex items-center justify-center gap-2 bg-slime text-ink font-bangers text-2xl uppercase tracking-wider px-8 py-4 border-4 border-ink rounded-sm shadow-brutal-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ icon, label, name, required, optional, children }) {
  return (
    <label className="block" htmlFor={name}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-muk">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-ink/70">
          {label}
          {required && <span className="text-muk ml-1">*</span>}
          {optional && <span className="text-ink/40 ml-1 normal-case font-normal tracking-normal">(optional)</span>}
        </span>
      </div>
      {children}
    </label>
  );
}
