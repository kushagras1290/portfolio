import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured, CONTACT_MESSAGES_TABLE, ADMIN_EMAIL } from '../lib/supabaseClient.js';

function formatTimestamp(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminMessages() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [linkSent, setLinkSent] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const isOwner = session?.user?.email === ADMIN_EMAIL;

  const loadMessages = useCallback(async () => {
    if (!isOwner) return;
    setLoadingMessages(true);
    setLoadError('');
    const { data, error } = await supabase
      .from(CONTACT_MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setLoadError('Could not load messages. Try refreshing.');
    } else {
      setMessages(data);
    }
    setLoadingMessages(false);
  }, [isOwner]);

  useEffect(() => {
    if (isOwner) loadMessages();
  }, [isOwner, loadMessages]);

  async function requestMagicLink() {
    setLinkError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) setLinkError('Could not send the login link. Try again shortly.');
    else setLinkSent(true);
  }

  async function toggleRead(message) {
    const { error } = await supabase
      .from(CONTACT_MESSAGES_TABLE)
      .update({ is_read: !message.is_read })
      .eq('id', message.id);
    if (!error) {
      setMessages(prev => prev.map(m => (m.id === message.id ? { ...m, is_read: !m.is_read } : m)));
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="page-enter">
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Admin</span>
          </div>
          <p className="label">Private</p>
          <h1 className="sec-title">Contact Messages</h1>
        </div>
      </div>

      <section style={{ background: 'var(--void-black)' }}>
        <div className="container">
          {!isSupabaseConfigured && (
            <p style={{ color: 'var(--terminal-amber)' }}>
              Supabase isn't configured in this environment (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
            </p>
          )}

          {isSupabaseConfigured && session === undefined && (
            <p style={{ color: 'var(--on-surface-var)' }}>Checking session…</p>
          )}

          {isSupabaseConfigured && session === null && (
            <div className="admin-gate">
              {!linkSent ? (
                <>
                  <p style={{ color: 'var(--on-surface-var)', marginBottom: '1.5rem', maxWidth: 480 }}>
                    This page is private. Requesting access sends a one-time sign-in link to the
                    site owner's inbox. It never goes to whoever clicks the button.
                  </p>
                  <button type="button" className="btn btn-primary" onClick={requestMagicLink}>
                    Send login link
                  </button>
                </>
              ) : (
                <p style={{ color: 'var(--neural-lime)' }}>
                  Login link sent. Check the owner's inbox and open it on this device.
                </p>
              )}
              {linkError && <p style={{ color: 'var(--terminal-amber)', marginTop: '1rem' }}>{linkError}</p>}
            </div>
          )}

          {isSupabaseConfigured && session && !isOwner && (
            <div>
              <p style={{ color: 'var(--terminal-amber)', marginBottom: '1rem' }}>
                Signed in, but this account isn't authorized to view messages.
              </p>
              <button type="button" className="btn btn-ghost" onClick={signOut}>Sign out</button>
            </div>
          )}

          {isOwner && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ color: 'var(--muted-code)', fontSize: '0.8rem' }}>
                  Signed in as {ADMIN_EMAIL}
                </span>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={loadMessages} disabled={loadingMessages}>
                    {loadingMessages ? 'Refreshing…' : 'Refresh'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={signOut}>Sign out</button>
                </div>
              </div>

              {loadError && <p style={{ color: 'var(--terminal-amber)', marginBottom: '1.5rem' }}>{loadError}</p>}

              {!loadingMessages && messages.length === 0 && !loadError && (
                <p style={{ color: 'var(--muted-code)' }}>No messages yet.</p>
              )}

              <div className="admin-message-list">
                {messages.map(m => (
                  <div className={`admin-message-card ${m.is_read ? '' : 'is-unread'}`} key={m.id}>
                    <div className="admin-message-top">
                      <div>
                        <div className="admin-message-name">{m.name}</div>
                        <div className="admin-message-email">{m.email}</div>
                      </div>
                      <div className="admin-message-when">{formatTimestamp(m.created_at)}</div>
                    </div>
                    <div className="admin-message-subject">{m.subject}</div>
                    <p className="admin-message-body">{m.message}</p>
                    <div className="admin-message-actions">
                      <a className="btn btn-ghost" href={`mailto:${m.email}`}>Reply ↗</a>
                      <button type="button" className="btn btn-ghost" onClick={() => toggleRead(m)}>
                        Mark as {m.is_read ? 'unread' : 'read'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
