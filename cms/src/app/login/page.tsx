/* eslint-disable @next/next/no-html-link-for-pages */
'use client'

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background:
          'radial-gradient(circle at top, #E1DAFE 0, #FFFFFF 45%, #DEFCFF 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.96)',
          borderRadius: 16,
          padding: '2rem 2.5rem',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
          border: '1px solid rgba(88,63,188,0.08)',
        }}
      >
        <h1
          style={{
            fontSize: '1.75rem',
            marginBottom: '0.5rem',
            color: '#242A41',
            fontWeight: 700,
          }}
        >
          Mason CMS Login
        </h1>
        <p
          style={{
            color: '#6B7280',
            marginBottom: '1.75rem',
            fontSize: 14,
          }}
        >
          Đăng nhập để quản lý Projects, Skills, Experience cho Portfolio.
        </p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              Email
            </span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#583FBC'
                e.currentTarget.style.boxShadow =
                  '0 0 0 1px rgba(88,63,188,0.25)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              Mật khẩu
            </span>
            <input
              type="password"
              required
              placeholder="••••••••"
              style={{
                padding: '0.75rem 0.9rem',
                borderRadius: 10,
                border: '1px solid #E5E7EB',
                fontSize: 14,
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#583FBC'
                e.currentTarget.style.boxShadow =
                  '0 0 0 1px rgba(88,63,188,0.25)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.8rem 1rem',
              borderRadius: 999,
              border: 'none',
              background:
                'linear-gradient(135deg, #583FBC 0%, #7DE0EA 50%, #FF8C69 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(88,63,188,0.35)',
            }}
          >
            Đăng nhập
          </button>

          <p
            style={{
              marginTop: '0.75rem',
              fontSize: 12,
              color: '#9CA3AF',
              textAlign: 'center',
            }}
          >
            (Hiện tại mới là UI, bước tiếp theo sẽ connect API auth & Supabase)
          </p>
        </form>
      </div>
    </main>
  )
}


