import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/client'
import Navbar from '../components/Navbar'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setSession } = useAuth() as any
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return
    setLoading(true)
    setError('')
    try {
      const isAdminPhone = phone === '9999999999'
      const res = await authApi.login(phone, name || 'Guest', isAdminPhone ? password || 'admin123' : undefined)
      localStorage.setItem('bluberry_token', res.token)
      if (setSession) {
        setSession(res.user, res.token)
      } else {
        // fallback for older auth context
        localStorage.setItem('bluberry_user', JSON.stringify(res.user))
      }
      navigate(res.user.role === 'admin' ? '/admin' : '/orders')
    } catch (err: any) {
      setError(err.message || 'Login failed. Start the backend first.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 pt-32 pb-16">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="font-display text-2xl text-blueberry-950 mb-2">Login</h1>
          <p className="text-gray-500 text-sm mb-6">Customer: phone only · Admin: phone + password</p>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blueberry-500" />
            <input placeholder="Mobile Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blueberry-500" required />
            {phone === '9999999999' && (
              <input type="password" placeholder="Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blueberry-500" />
            )}
            <button type="submit" disabled={loading} className="w-full bg-blueberry-700 text-white py-3.5 rounded-full font-semibold disabled:opacity-60">
              {loading ? 'Signing in…' : 'Continue'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-6 text-center">
            Admin: phone <strong>9999999999</strong> / password <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
