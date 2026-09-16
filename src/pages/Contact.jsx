import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
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
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  useScrollReveal();

  async function submitForm(e) {
    e.preventDefault();

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

    const form = e.currentTarget;
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
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShowConfetti(true);
    }
  }

  return (
    <div className="page-enter">
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Contact</span>
          </div>
          <p className="label">Get In Touch</p>
          <h1 className="sec-title">
            Let's Build<br />Something Real
          </h1>
        </div>
      </div>

      <section style={{ background: 'var(--void-black)' }}>
        <div className="container">
          <div className="contact-wrap reveal">
            {/* Left */}
            <div className="contact-left">
              <h2 className="contact-heading">
                Open to<br /><em>New Roles</em>
              </h2>
              <p className="contact-sub">
                Looking for an AI engineer who can take a problem from whiteboard to production,
                whether solo or as part of a high-velocity team. I work best on ambiguous, high-impact
                challenges that need both deep technical execution and product-level thinking.
              </p>
              <div className="c-links">
                <div className="c-link">
                  <a href="mailto:kushagras1234890@gmail.com" className="c-link-main">
                    <span className="c-ico">✉</span>
                    <div>
                      <div className="c-link-type">EMAIL</div>
                      kushagras1234890@gmail.com
                    </div>
                  </a>
                  <button
                    type="button"
                    className="c-copy-btn"
                    aria-label="Copy email address"
                    onClick={() => copyToClipboard('kushagras1234890@gmail.com', 'Email')}
                  >
                    ⧉
                  </button>
                </div>
                <div className="c-link">
                  <a href="tel:+918081576126" className="c-link-main">
                    <span className="c-ico">✆</span>
                    <div>
                      <div className="c-link-type">PHONE</div>
                      +91 8081576126
                    </div>
                  </a>
                  <button
                    type="button"
                    className="c-copy-btn"
                    aria-label="Copy phone number"
                    onClick={() => copyToClipboard('+918081576126', 'Phone number')}
                  >
                    ⧉
                  </button>
                </div>
                <a
                  href="https://www.linkedin.com/in/kushagra-singh-6aa5a1229"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-link"
                >
                  <span className="c-ico">in</span>
                  <div>
                    <div className="c-link-type">LINKEDIN</div>
                    kushagra-singh-6aa5a1229
                  </div>
                </a>
                <a
                  href="https://github.com/kushagras1290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c-link"
                >
                  <span className="c-ico">⌥</span>
                  <div>
                    <div className="c-link-type">GITHUB</div>
                    github.com/kushagras1290
                  </div>
                </a>
              </div>
            </div>

            {/* Right - form */}
            <div className="contact-right">
              <p className="label" style={{ marginBottom: '1.5rem' }}>Send a message</p>
              {status === 'sent' ? (
                <div style={{
                  padding: '2.5rem',
                  background: 'rgba(76,242,216,0.06)',
                  border: '0.5px solid rgba(76,242,216,0.2)',
                  borderRadius: 'var(--r)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--neural-lime)' }}>✓</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--data-white)', marginBottom: '0.5rem' }}>
                    Message sent!
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-var)' }}>
                    I'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form className="form" onSubmit={submitForm}>
                  <div className="fg">
                    <label className="fl" htmlFor="fn">Name</label>
                    <input className="fi" type="text" id="fn" name="fn" placeholder="Your name" required maxLength={200} />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fe">Email</label>
                    <input className="fi" type="email" id="fe" name="fe" placeholder="your@email.com" required maxLength={320} />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fs">Subject</label>
                    <input className="fi" type="text" id="fs" name="fs" placeholder="Role, project, collab…" required maxLength={300} />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fm">Message</label>
                    <textarea
                      className="fta"
                      id="fm"
                      name="fm"
                      placeholder="Tell me about the opportunity or project…"
                      required
                      maxLength={5000}
                    />
                  </div>
                  {status === 'error' && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--terminal-amber)' }} role="alert">
                      {errorMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start' }}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message ↗'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
