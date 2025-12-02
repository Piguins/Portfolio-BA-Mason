export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'radial-gradient(circle at top, #E1DAFE 0, #FFFFFF 45%, #DEFCFF 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, system-ui, -system-ui, \"Segoe UI\", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: '100%',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 16,
          padding: '2rem 2.5rem',
          boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
          border: '1px solid rgba(88,63,188,0.08)',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '0.75rem',
            color: '#242A41',
            fontWeight: 700,
          }}
        >
          Mason Portfolio CMS
        </h1>
        <p style={{ color: '#585F6F', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Đây sẽ là dashboard quản lý nội dung cho website portfolio của bạn.
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: '0.75rem',
          }}
        >
          <li style={{ color: '#242A41' }}>• Quản lý Projects / Case Studies</li>
          <li style={{ color: '#242A41' }}>• Quản lý Skills, Tools, Certifications</li>
          <li style={{ color: '#242A41' }}>• Quản lý Experience / Timeline</li>
          <li style={{ color: '#242A41' }}>
            • Kết nối tới API Node.js + PostgreSQL (apps/api) để lưu content
          </li>
        </ul>

        <p style={{ marginTop: '1.75rem', fontSize: 14, color: '#6878AC' }}>
          Tiếp theo: định nghĩa cấu trúc data (models) và xây dựng trang login, list, edit cho từng
          loại content.
        </p>
      </div>
    </main>
  )
}


