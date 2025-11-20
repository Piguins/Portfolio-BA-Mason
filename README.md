# Portfolio Website - Business Analyst

Portfolio website chuyên nghiệp được xây dựng bằng React JS cho Business Analyst.

## 🚀 Tính năng

- ✨ UI hiện đại và responsive
- 📱 Tối ưu cho mobile
- 🎨 Thiết kế đẹp mắt với gradient và animations
- 📄 Các trang: Trang chủ, Giới thiệu, Dự án, Kỹ năng, Liên hệ
- 🔄 React Router cho navigation
- ⚡ Vite build tool cho performance tốt

## 🛠️ Công nghệ sử dụng

- **React 18** - UI library
- **React Router** - Routing
- **Vite** - Build tool
- **React Icons** - Icon library
- **CSS3** - Styling với custom properties

## 📦 Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Build cho production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📁 Cấu trúc thư mục

```
Portfolio-BA-Mason/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Tùy chỉnh

### Thay đổi thông tin cá nhân

1. **Trang chủ**: Sửa file `src/pages/Home.jsx`
2. **Giới thiệu**: Sửa file `src/pages/About.jsx`
3. **Dự án**: Sửa file `src/pages/Projects.jsx`
4. **Kỹ năng**: Sửa file `src/pages/Skills.jsx`
5. **Liên hệ**: Sửa file `src/pages/Contact.jsx`
6. **Footer**: Sửa file `src/components/Footer.jsx`

### Thay đổi màu sắc

Sửa các biến CSS trong `src/index.css`:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --accent-color: #3b82f6;
  /* ... */
}
```

## 📤 Deploy lên GitHub

### 1. Khởi tạo Git repository (nếu chưa có)

```bash
git init
```

### 2. Thêm remote repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/Portfolio-BA-Mason.git
```

### 3. Thêm và commit files

```bash
git add .
git commit -m "Initial commit: Portfolio website"
```

### 4. Push lên GitHub

```bash
git branch -M main
git push -u origin main
```

## 🌐 Deploy

Website có thể được deploy lên:
- **Vercel**: Kết nối GitHub repo và auto-deploy
- **Netlify**: Drag & drop hoặc kết nối GitHub
- **GitHub Pages**: Sử dụng GitHub Actions

## 📝 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

## 👤 Tác giả

Mason - Business Analyst

---

Made with ❤️ using React
