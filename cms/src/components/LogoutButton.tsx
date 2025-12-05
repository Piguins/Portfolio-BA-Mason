'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    setLoading(false)
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-lg font-medium px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed'
      )}
    >
      <LogOut className="w-4 h-4" />
      {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  )
}
