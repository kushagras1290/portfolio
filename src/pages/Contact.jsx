import { useState } from 'react';
import HumanoidStory from '../components/HumanoidStory.jsx';
import { supabase, isSupabaseConfigured, CONTACT_MESSAGES_TABLE } from '../lib/supabaseClient.js';
import { showToast } from '../lib/toast.js';
import ConfettiBurst from '../components/ConfettiBurst.jsx';

const COOLDOWN_KEY = 'ks-contact-last-submit';
const COOLDOWN_MS = 30_000;

async function copyToClipboard(value, label) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(`${label} copied to clipboard`);
  } catch {
    showToast(`Couldn't copy ${label.toLowerCase()}. Copy it manually instead.`);
  }
}

export default function Contact() {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  async function submitForm(event) {
    event.preventDefault();
    const lastSubmit = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    if (Date.now() - lastSubmit < COOLDOWN_MS) {
      setStatus('error');
      setErrorMessage("You've just sent a message. Give it a moment before sending another.");
      return;
    }
    if (!isSupabaseConfigured) {
      setStatus('error');
      setErrorMessage('The contact form is temporarily unavailable. Please email me directly instead.');
      return;
    }

    const form = event.currentTarget;
    const payload = {
      name: form.fn.value.trim(),
      email: form.fe.value.trim(),
      subject: form.fs.value.trim(),
      message: form.fm.value.trim(),
    };
    setStatus('sending');
    const { error } = await supabase.from(CONTACT_MESSAGES_TABLE).insert(payload);
    if (error) {
      setStatus('error');
      setErrorMessage('Something went wrong sending that. Please try again or email me directly.');
      return;
    }
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    setStatus('sent');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setShowConfetti(true);
  }

  const contactSlide = {
    id: 'contact-channels',
    eyebrow: 'OPEN TO ROLES AND COLLABORATION',
    railTitle: 'Contact Channels',
    title: 'Let’s Build Something Real',
    summary: 'I work best on ambiguous, high-impact problems that need both deep technical execution and product-level thinking.',
    tone: '#7ddbd2',
    chapter: 'Start a Conversation',
    footer: 'GURUGRAM · REMOTE · AVAILABLE',
    content: (
      <div className="hm-contact-tiles">
        <div className="hm-contact-tile">
          <a href="mailto:kushagras1234890@gmail.com"><small>Email</small><strong>kushagras1234890@gmail.com</strong></a>
          <button type="button" onClick={() => copyToClipboard('kushagras1234890@gmail.com', 'Email')} aria-label="Copy email">⧉</button>
        </div>
        <div className="hm-contact-tile">
          <a href="tel:+918081576126"><small>Phone</small><strong>+91 8081576126</strong></a>
          <button type="button" onClick={() => copyToClipboard('+918081576126', 'Phone number')} aria-label="Copy phone number">⧉</button>
        </div>
        <a className="hm-contact-tile" href="https://www.linkedin.com/in/kushagra-singh-6aa5a1229" target="_blank" rel="noopener noreferrer">
          <small>LinkedIn</small><strong>kushagra-singh-6aa5a1229 ↗</strong>
        </a>
        <a className="hm-contact-tile" href="https://github.com/kushagras1290" target="_blank" rel="noopener noreferrer">
          <small>GitHub</small><strong>github.com/kushagras1290 ↗</strong>
        </a>
      </div>
    ),
    secondaryAction: { href: 'mailto:kushagras1234890@gmail.com', label: 'Email directly' },
  };

  const formSlide = {
    id: 'contact-form',
    eyebrow: 'SEND A MESSAGE',
    railTitle: 'Project or Role Inquiry',
    title: status === 'sent' ? 'Message Received' : 'Tell Me About the Work',
    summary: status === 'sent'
      ? 'Thanks for reaching out. I will get back to you within 24 hours.'
      : 'Share the role, product, or system you are building and the problem that needs to be solved.',
    tone: '#9aaeff',
    chapter: 'Send a Message',
    footer: 'DIRECT CONTACT · 24-HOUR RESPONSE TARGET',
    content: status === 'sent' ? (
      <div className="hm-success-tile"><strong>Message sent</strong><span>Your note is now in my inbox.</span></div>
    ) : (
      <form className="hm-story-form" onSubmit={submitForm}>
        <div className="hm-story-field">
          <label htmlFor="fn">Name</label>
          <input type="text" id="fn" name="fn" required maxLength={200} />
        </div>
        <div className="hm-story-field">
          <label htmlFor="fe">Email</label>
          <input type="email" id="fe" name="fe" required maxLength={320} />
        </div>
        <div className="hm-story-field full">
          <label htmlFor="fs">Subject</label>
          <input type="text" id="fs" name="fs" required maxLength={300} />
        </div>
        <div className="hm-story-field full">
          <label htmlFor="fm">Message</label>
          <textarea id="fm" name="fm" required maxLength={5000} />
        </div>
        {status === 'error' && <p className="hm-story-status" role="alert">{errorMessage}</p>}
        <button className="hm-story-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message ↗'}
        </button>
      </form>
    ),
    secondaryAction: { href: 'mailto:kushagras1234890@gmail.com', label: 'Use email instead' },
  };

  return (
    <>
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
      <HumanoidStory slides={[contactSlide, formSlide]} railLabel="Contact" pageLabel="Contact · Open Channel" />
    </>
  );
}
