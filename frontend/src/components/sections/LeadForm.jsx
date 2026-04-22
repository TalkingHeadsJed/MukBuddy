import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/lib/constants";
import { Overline } from "@/components/sections/Problem";
import { Send, Mail, Phone, User, Users, MessageSquare } from "lucide-react";

const emptyForm = { name: "", email: "", phone: "", crew_size: "", message: "", website: "" };

export default function LeadForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
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
        website: form.website || null,
      };
      await axios.post(`${API}/leads`, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });
      setSent(true);
      setForm(emptyForm);
      toast.success("Message sent. We'll be in touch.");
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
    <section id="contact" data-testid="lead-form-section" className="relative py-24 sm:py-32 bg-zinc-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
        {/* Left copy */}
        <div className="lg:col-span-5 space-y-6">
          <Overline>13 · Questions?</Overline>
          <h2 className="font-anton text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.95]">
            Fit, volume pricing, <br />
            crew rollout — <span className="text-yellow-400">ask.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-md">
            Have a question before you order? Send it over. A real human gets
            back to you — not a bot, not a call center.
          </p>
          <ul className="pt-4 space-y-3 text-zinc-300">
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-yellow-400" /> Fleet & crew pricing</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-yellow-400" /> Vacuum fit & compatibility</li>
            <li className="flex items-center gap-3"><span className="w-2 h-2 bg-yellow-400" /> Bulk orders for GCs</li>
          </ul>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <form
            data-testid="lead-form"
            onSubmit={onSubmit}
            className="bg-zinc-900 border border-zinc-700 p-6 sm:p-10"
            noValidate
          >
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={form.website}
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
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 outline-none focus:border-yellow-400 transition-colors"
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
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 outline-none focus:border-yellow-400 transition-colors"
                />
              </Field>
              <Field icon={<Phone className="w-4 h-4" />} label="Phone" name="phone" optional>
                <input
                  data-testid="lead-phone"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  maxLength={25}
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 outline-none focus:border-yellow-400 transition-colors"
                />
              </Field>
              <Field icon={<Users className="w-4 h-4" />} label="Crew Size" name="crew_size" optional>
                <select
                  data-testid="lead-crew"
                  name="crew_size"
                  value={form.crew_size}
                  onChange={onChange}
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 outline-none focus:border-yellow-400 transition-colors"
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
                  className="w-full bg-black border border-zinc-800 text-white px-4 py-3 outline-none focus:border-yellow-400 transition-colors resize-none"
                  placeholder="What do you want to know?"
                />
              </Field>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-zinc-500 max-w-sm">
                By submitting, you agree to be contacted about Muk Buddy. We
                don't share or sell your info.
              </p>
              <button
                type="submit"
                disabled={submitting}
                data-testid="lead-submit"
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold uppercase tracking-wider px-8 py-4 border-2 border-yellow-400 hover:bg-black hover:text-yellow-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : sent ? "Sent — Send Another?" : "Send Message"}
                <Send className="w-4 h-4" />
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
        <span className="text-yellow-400">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
          {label}
          {required && <span className="text-yellow-400 ml-1">*</span>}
          {optional && <span className="text-zinc-600 ml-1 normal-case font-normal tracking-normal">(optional)</span>}
        </span>
      </div>
      {children}
    </label>
  );
}
