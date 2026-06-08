import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

export default function Contact() {
  const [status, setStatus] = useState('idle');
  useScrollReveal();

  function submitForm(e) {
    e.preventDefault();
    setStatus('sent');
  }

  return (
    <div className="page-enter">
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
                Looking for an AI engineer who can take a problem from whiteboard to production —
                solo or as part of a high-velocity team. I work best on ambiguous, high-impact
                challenges that need both deep technical execution and product-level thinking.
              </p>
              <div className="c-links">
                <a href="mailto:kushagras1234890@gmail.com" className="c-link">
                  <span className="c-ico">✉</span>
                  <div>
                    <div className="c-link-type">EMAIL</div>
                    kushagras1234890@gmail.com
                  </div>
                </a>
                <a href="tel:+918081576126" className="c-link">
                  <span className="c-ico">✆</span>
                  <div>
                    <div className="c-link-type">PHONE</div>
                    +91 8081576126
                  </div>
                </a>
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
              <p className="label" style={{ marginBottom: '1.5rem' }}>// Send a message</p>
              {status === 'sent' ? (
                <div style={{
                  padding: '2.5rem',
                  background: 'rgba(200,240,106,0.06)',
                  border: '0.5px solid rgba(200,240,106,0.2)',
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
                    <input className="fi" type="text" id="fn" placeholder="Your name" required />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fe">Email</label>
                    <input className="fi" type="email" id="fe" placeholder="your@email.com" required />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fs">Subject</label>
                    <input className="fi" type="text" id="fs" placeholder="Role, project, collab…" required />
                  </div>
                  <div className="fg">
                    <label className="fl" htmlFor="fm">Message</label>
                    <textarea
                      className="fta"
                      id="fm"
                      placeholder="Tell me about the opportunity or project…"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Send Message ↗
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
