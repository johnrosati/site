import React, { useState } from 'react';

// Replace this with your Formspree endpoint URL (from your Formspree dashboard)
// Example: https://formspree.io/f/abcdwxyz
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjnvagl';

const ShopModalContent = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-[55vh] flex items-center justify-center bg-paper">
      <div className="w-full max-w-md px-6 py-10">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-semibold tracking-widest text-ink">
            SHOP
          </div>
          <div className="mt-3 text-sm text-ink/70">
            Get updates when the shop opens.
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
          {/* Honeypot */}
          <input
            type="text"
            name="_gotcha"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-ink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm tracking-wide text-ink hover:border-accent disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Join'}
          </button>

          {status === 'success' && (
            <div className="pt-1 text-sm text-ink/70">Thanks — you’re on the list.</div>
          )}
          {status === 'error' && (
            <div className="pt-1 text-sm text-ink/70">
              Something went wrong. Try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ShopModalContent;   