# Portfolio Website - Business Analyst

Portfolio website chuyên nghiệp được xây dựng bằng React JS cho Business Analyst.

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Tính năng](#tính-năng)
3. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
4. [Cài đặt](#cài-đặt)
5. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
6. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
7. [Tùy chỉnh](#tùy-chỉnh)
8. [Deployment](#deployment)
9. [License](#license)
10. [Tác giả](#tác-giả)

## Giới thiệu

Đây là một portfolio website được thiết kế và phát triển dành riêng cho Business Analyst. Website được xây dựng với React JS và Vite, đảm bảo hiệu suất cao và trải nghiệm người dùng tốt.

Website được thiết kế theo phong cách hiện đại, responsive trên mọi thiết bị, và tối ưu hóa cho SEO. Toàn bộ giao diện được xây dựng bằng plain CSS với custom properties, không sử dụng các framework CSS nặng.

## Tính năng

- Giao diện hiện đại và responsive, tương thích với mọi kích thước màn hình
- Tối ưu hóa cho thiết bị di động với trải nghiệm mượt mà
- Thiết kế đẹp mắt với animations và transitions
- Single-page application (SPA) với smooth scrolling
- Cấu trúc code được tổ chức rõ ràng, dễ bảo trì
- Tối ưu hóa hiệu suất với Vite build tool
- Tự động deploy lên Vercel khi push code lên GitHub

## Công nghệ sử dụng

- **React 18.2.0** - Thư viện JavaScript cho xây dựng giao diện người dùng
- **Vite 5.0.8** - Build tool nhanh chóng và hiệu quả
- **React Icons 4.12.0** - Thư viện icon cho React
- **CSS3** - Plain CSS với custom properties (CSS variables) để quản lý theme

## Cài đặt

### Yêu cầu hệ thống

- Node.js phiên bản 16 trở lên
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository về máy:

```bash
git clone https://github.com/Piguins/Portfolio-BA-Mason.git
cd Portfolio-BA-Mason
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Chạy development server:

```bash
npm run dev
```

Website sẽ chạy tại `http://localhost:3000`

4. Build cho production:

```bash
npm run build
```

Files sau khi build sẽ nằm trong thư mục `dist/`

5. Preview production build:

```bash
npm run preview
```

## Cấu trúc thư mục

```
Portfolio-BA-Mason/
├── src/
│   ├── components/          # Các components dùng chung
│   │   ├── Navbar/          # Navigation bar
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   └── index.js     # Barrel export
│   │   └── Footer/          # Footer component
│   │       ├── Footer.jsx
│   │       ├── Footer.css
│   │       └── index.js
│   ├── pages/               # Các sections của website
│   │   ├── Home/            # Home page container
│   │   ├── Hero/            # Hero section
│   │   ├── Skills/          # Skills section
│   │   ├── Portfolio/       # Portfolio section
│   │   ├── Reviews/         # Reviews section
│   │   ├── FAQ/             # FAQ section
│   │   └── CTA/             # Call-to-action section
│   ├── constants/           # Các constants
│   │   └── images.js        # Quản lý tất cả image URLs
│   ├── App.jsx              # Main App component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles và CSS variables
├── public/                  # Static files
│   └── .htaccess            # Apache configuration (nếu cần)
├── document/                # Tài liệu
│   └── VERCEL_SETUP.md      # Hướng dẫn setup Vercel
├── index.html               # HTML template
├── package.json             # Dependencies và scripts
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel configuration
└── README.md                # File này
```

## Hướng dẫn sử dụng

### Development

Sau khi cài đặt dependencies, chạy lệnh sau để khởi động development server:

```bash
npm run dev
```

Development server sẽ tự động reload khi bạn thay đổi code.

### Production Build

Để build project cho production:

```bash
npm run build
```

Kết quả build sẽ nằm trong thư mục `dist/`, sẵn sàng để deploy lên hosting.

## Tùy chỉnh

### Thay đổi thông tin cá nhân

Các sections của website có thể được tùy chỉnh thông qua các file sau:

1. **Hero Section** - Thông tin giới thiệu chính:
   - File: `src/pages/Hero/Hero.jsx`
   - Styles: `src/pages/Hero/Hero.css`

2. **Skills Section** - Kỹ năng và công nghệ:
   - File: `src/pages/Skills/Skills.jsx`
   - Styles: `src/pages/Skills/Skills.css`

3. **Portfolio Section** - Các dự án đã thực hiện:
   - File: `src/pages/Portfolio/Portfolio.jsx`
   - Styles: `src/pages/Portfolio/Portfolio.css`

4. **Reviews Section** - Đánh giá từ khách hàng:
   - File: `src/pages/Reviews/Reviews.jsx`
   - Styles: `src/pages/Reviews/Reviews.css`

5. **FAQ Section** - Câu hỏi thường gặp:
   - File: `src/pages/FAQ/FAQ.jsx`
   - Styles: `src/pages/FAQ/FAQ.css`

6. **CTA Section** - Call-to-action:
   - File: `src/pages/CTA/CTA.jsx`
   - Styles: `src/pages/CTA/CTA.css`

7. **Navigation Bar**:
   - File: `src/components/Navbar/Navbar.jsx`
   - Styles: `src/components/Navbar/Navbar.css`

8. **Footer**:
   - File: `src/components/Footer/Footer.jsx`
   - Styles: `src/components/Footer/Footer.css`

### Thay đổi Images

Tất cả image URLs được quản lý tập trung tại file `src/constants/images.js`. Để thay đổi images, chỉ cần sửa file này:

```javascript
export const heroImages = {
  imgImage: "URL_HERE",
  // ...
};

export const skillsImages = {
  imgCircles: "URL_HERE",
  // ...
};
```

### Thay đổi màu sắc và theme

Màu sắc của website được quản lý thông qua CSS variables trong file `src/index.css`:

```css
:root {
  --primary-color: #583FBC;
  --secondary-color: #7DE0EA;
  --accent-color: #2CCCC8;
  --dark-blue: #242A41;
  --text-dark: #1D2130;
  --text-light: #585F6F;
  /* ... */
}
```

Thay đổi các giá trị này sẽ cập nhật màu sắc trên toàn bộ website.

### Thay đổi fonts

Fonts được import từ Google Fonts trong file `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
```

Fonts được sử dụng thông qua CSS variables:

```css
:root {
  --font-primary: 'Manrope', sans-serif;
  --font-secondary: 'Roboto', sans-serif;
}
```

## Deployment

### Deploy lên Vercel (Khuyến nghị)

Website đã được cấu hình sẵn để deploy lên Vercel. Vercel cung cấp:

- Miễn phí cho projects cá nhân
- Tự động deploy khi push code lên GitHub
- HTTPS tự động
- CDN toàn cầu
- Custom domain support

#### Các bước deploy:

1. Đăng ký tài khoản tại [Vercel](https://vercel.com)
2. Import project từ GitHub repository
3. Vercel sẽ tự động detect cấu hình từ `vercel.json`
4. Sau khi deploy, thêm custom domain (nếu có)
5. Mỗi lần push code lên GitHub, website sẽ tự động được deploy

Xem hướng dẫn chi tiết tại: [document/VERCEL_SETUP.md](./document/VERCEL_SETUP.md)

### Deploy lên hosting khác

1. Build project:
   ```bash
   npm run build
   ```

2. Upload toàn bộ nội dung trong thư mục `dist/` lên hosting
3. Cấu hình web server để hỗ trợ SPA routing (xem file `public/.htaccess` cho Apache)

### GitHub Repository

Repository hiện tại: `https://github.com/Piguins/Portfolio-BA-Mason`

## License

MIT License

Bạn được tự do sử dụng, chỉnh sửa, và phân phối code này cho mục đích cá nhân hoặc thương mại.

## Tác giả

**Mason** - Business Analyst

---

Project được xây dựng bằng React và Vite.
