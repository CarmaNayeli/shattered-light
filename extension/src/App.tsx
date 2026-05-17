import { useState, useEffect } from 'react'
import { useOBR } from './hooks/useOBR'
import { supabase } from './lib/supabase'
import { PlayerView } from './components/player/PlayerView'
import { GMView } from './components/gm/GMView'
import type { User } from '@supabase/supabase-js'

const RESET_REDIRECT = 'https://shattered-light-ttrpg.vercel.app/app/'

type AuthView = 'loading' | 'signin' | 'recovery' | 'ready'
type AuthMode = 'signin' | 'signup' | 'reset'

function StarLogo() {
  return (
    <svg viewBox="0 0 512 512" className="w-12 h-12 mx-auto" aria-hidden="true">
      <polygon points="256,256 207,188 256,36 305,188"   fill="#FFFFFF" stroke="#A8C8F0" strokeWidth="2"/>
      <polygon points="256,256 305,188 465,188 336,282"  fill="#F5E06B"/>
      <polygon points="256,256 336,282 385,434 256,340"  fill="#2C2C2C"/>
      <polygon points="256,256 256,340 127,434 176,282"  fill="#F4A0C0"/>
      <polygon points="256,256 176,282 47,188 207,188"   fill="#A8C8F0"/>
    </svg>
  )
}

function AuthForm({ onAuth }: { onAuth: (user: User) => void }) {
  const [mode, setMode]           = useState<AuthMode>('signin')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [busy, setBusy]           = useState(false)
  const [resetSent, setResetSent] = useState(false)

  function switchMode(m: AuthMode) { setMode(m); setError(''); setResetSent(false) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError('')
    if (mode === 'reset') {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: RESET_REDIRECT })
      setBusy(false)
      if (err) { setError(err.message); return }
      setResetSent(true); return
    }
    const fn = mode === 'signup'
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password })
    const { data, error: err } = await fn
    if (err) { setError(err.message); setBusy(false); return }
    if (data.user) onAuth(data.user)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-sl-bg">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-2">
          <StarLogo />
          <h1 className="text-xl font-bold text-sl-accent font-mono tracking-widest">SHATTERED LIGHT</h1>
          <p className="text-xs text-sl-muted">{mode === 'reset' ? 'Reset your password' : 'Sign in to access your character'}</p>
        </div>
        {resetSent ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-sl-text">Check your email — we sent a reset link to <span className="text-sl-accent">{email}</span>.</p>
            <button onClick={() => switchMode('signin')} className="text-xs text-sl-muted hover:text-sl-text">Back to sign in</button>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="space-y-3">
              <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-sl-surface border border-sl-border rounded px-3 py-2 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent" />
              {mode !== 'reset' && (
                <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-sl-surface border border-sl-border rounded px-3 py-2 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent" />
              )}
              {error && <p className="text-sl-danger text-xs">{error}</p>}
              <button type="submit" disabled={busy}
                className="w-full py-2 rounded bg-sl-accent text-sl-accent-fg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {busy ? '…' : mode === 'signup' ? 'Create Account' : mode === 'reset' ? 'Send Reset Link' : 'Sign In'}
              </button>
            </form>
            <div className="flex flex-col items-center gap-1">
              {mode === 'signin' && (<>
                <button onClick={() => switchMode('signup')} className="text-xs text-sl-muted hover:text-sl-text">Don't have an account? Sign up</button>
                <button onClick={() => switchMode('reset')} className="text-xs text-sl-muted hover:text-sl-text">Forgot password?</button>
              </>)}
              {mode === 'signup' && <button onClick={() => switchMode('signin')} className="text-xs text-sl-muted hover:text-sl-text">Already have an account? Sign in</button>}
              {mode === 'reset'  && <button onClick={() => switchMode('signin')} className="text-xs text-sl-muted hover:text-sl-text">Back to sign in</button>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SetNewPasswordForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [busy, setBusy]         = useState(false)
  const [done, setDone]         = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters'); return }
    setBusy(true); setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (err) { setError(err.message); return }
    setDone(true); setTimeout(onDone, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-sl-bg">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center"><StarLogo /><h1 className="text-xl font-bold text-sl-accent mt-2">Choose a new password</h1></div>
        {done ? <p className="text-sm text-center text-sl-text">Password updated! Signing you in…</p> : (
          <form onSubmit={submit} className="space-y-3">
            <input type="password" required placeholder="New password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-sl-surface border border-sl-border rounded px-3 py-2 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent" />
            <input type="password" required placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)}
              className="w-full bg-sl-surface border border-sl-border rounded px-3 py-2 text-sm text-sl-text placeholder-sl-muted focus:outline-none focus:border-sl-accent" />
            {error && <p className="text-sl-danger text-xs">{error}</p>}
            <button type="submit" disabled={busy} className="w-full py-2 rounded bg-sl-accent text-sl-accent-fg text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {busy ? '…' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function App() {
  const obr = useOBR()
  const [authView, setAuthView] = useState<AuthView>('loading')
  const [user, setUser]         = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthView(prev => prev === 'recovery' ? prev : (data.session?.user ? 'ready' : 'signin'))
      if (data.session?.user) setUser(data.session.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') { setAuthView('recovery'); return }
      setUser(session?.user ?? null)
      setAuthView(prev => prev === 'recovery' ? 'recovery' : (session?.user ? 'ready' : 'signin'))
    })
    return () => subscription.unsubscribe()
  }, [])

  if (authView === 'recovery') return <SetNewPasswordForm onDone={() => { window.location.href = '/' }} />

  if (!obr.ready || authView === 'loading') {
    return (
      <div className="flex items-center justify-center h-full bg-sl-bg">
        <div className="text-center space-y-3"><StarLogo /><p className="text-sl-muted text-sm">Connecting…</p></div>
      </div>
    )
  }

  if (authView === 'signin' || !user) return <AuthForm onAuth={setUser} />

  async function signOut() { await supabase.auth.signOut() }

  if (obr.role === 'GM') {
    return <GMView supabaseUserId={user.id} playerId={obr.playerId} playerName={obr.playerName} roomId={obr.roomId} userEmail={user.email ?? ''} onSignOut={signOut} />
  }

  return (
    <PlayerView
      supabaseUserId={user.id}
      playerId={obr.playerId}
      playerName={obr.playerName}
      roomId={obr.roomId}
      userEmail={user.email ?? ''}
      onSignOut={signOut}
    />
  )
}
