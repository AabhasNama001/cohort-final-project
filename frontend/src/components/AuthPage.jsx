import React, { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function AuthPage() {
  const { login, register, logout, user } = useContext(AuthContext)
  const [isRegister, setIsRegister] = useState(false)

  // login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // register fields
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('user')

  const doLogin = async () => {
    try {
      await login({ email, password })
      alert('Logged in')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  const doRegister = async () => {
    try {
      await register({
        username,
        email,
        password,
        fullName: { firstName, lastName },
        role,
      })
      alert('Registered and logged in')
    } catch (err) {
      console.error(err)
      alert('Registration failed')
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      {user ? (
        <div>
          <div className="font-semibold">Welcome {user.username || user.email}</div>
          <div className="text-sm text-gray-600">Role: {user.role}</div>
          <button onClick={logout} className="mt-3 bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setIsRegister(false)} className={`flex-1 p-2 rounded ${!isRegister ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Login</button>
            <button onClick={() => setIsRegister(true)} className={`flex-1 p-2 rounded ${isRegister ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Register</button>
          </div>

          {!isRegister ? (
            <div>
              <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 w-full mb-2" />
              <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 w-full mb-2" />
              <button onClick={doLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
            </div>
          ) : (
            <div className="space-y-2">
              <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} className="border p-2 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="First name" value={firstName} onChange={e=>setFirstName(e.target.value)} className="border p-2 w-full" />
                <input placeholder="Last name" value={lastName} onChange={e=>setLastName(e.target.value)} className="border p-2 w-full" />
              </div>
              <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 w-full" />
              <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 w-full" />
              <select value={role} onChange={e=>setRole(e.target.value)} className="border p-2 w-full">
                <option value="user">Customer</option>
                <option value="seller">Seller</option>
              </select>
              <div className="flex gap-2">
                <button onClick={doRegister} className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
                <button onClick={() => setIsRegister(false)} className="px-4 py-2 border rounded">Back</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
