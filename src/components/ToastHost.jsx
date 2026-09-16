import { useEffect, useRef, useState } from 'react';
import { TOAST_EVENT } from '../lib/toast.js';

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    function onToast(e) {
      const id = ++idRef.current;
      const { message, duration } = e.detail;
      setToasts(current => [...current, { id, message }]);
      setTimeout(() => {
        setToasts(current => current.filter(t => t.id !== id));
      }, duration);
    }
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map(t => (
        <div className="toast" key={t.id}>{t.message}</div>
      ))}
    </div>
  );
}
