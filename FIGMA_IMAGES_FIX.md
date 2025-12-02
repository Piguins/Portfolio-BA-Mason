# Hướng dẫn sửa lỗi ảnh từ Figma

## Vấn đề
Các URL ảnh từ Figma MCP API (`https://www.figma.com/api/mcp/asset/...`) không phải là URL ảnh trực tiếp và không thể sử dụng trong thẻ `<img>`. Đây là các API endpoints, không phải file ảnh thực tế.

## Giải pháp đã áp dụng
1. ✅ Đã thêm error handling cho tất cả ảnh - ảnh lỗi sẽ tự ẩn đi
2. ✅ Đã thêm React Icons làm fallback cho social icons (LinkedIn, GitHub, Email)
3. ✅ Đã cập nhật tất cả components để xử lý ảnh thiếu/lỗi

## Cách sửa để có ảnh hiển thị

### Cách 1: Export từ Figma và upload lên CDN (Khuyến nghị)

1. **Export ảnh từ Figma:**
   - Mở file Figma của bạn
   - Chọn từng element/asset cần export
   - Click Export → Chọn format (PNG cho ảnh, SVG cho icons/vectors)
   - Download về máy

2. **Upload lên CDN:**
   - Sử dụng [PostImg.cc](https://postimg.cc/) (giống như heroImage)
   - Hoặc [Imgur](https://imgur.com/)
   - Hoặc [Cloudinary](https://cloudinary.com/)
   - Hoặc bất kỳ CDN nào khác

3. **Cập nhật URLs trong `src/constants/images.js`:**
   ```javascript
   linkedinIcon: "https://i.postimg.cc/your-linkedin-icon.png",
   githubIcon: "https://i.postimg.cc/your-github-icon.png",
   // ... etc
   ```

### Cách 2: Lưu ảnh trong thư mục `public`

1. Tạo thư mục `public/images/`
2. Copy tất cả ảnh vào thư mục này
3. Cập nhật URLs trong `src/constants/images.js`:
   ```javascript
   linkedinIcon: "/images/linkedin-icon.png",
   githubIcon: "/images/github-icon.png",
   // ... etc
   ```

### Cách 3: Sử dụng Figma Export API (Nâng cao)

Nếu bạn có Figma API token, có thể sử dụng Figma API để export ảnh tự động. Cần:
- Figma Personal Access Token
- File key và Node IDs của các assets

## Danh sách ảnh cần thay thế

Cập nhật các URL sau trong `src/constants/images.js`:

### Social Icons
- [ ] `linkedinIcon` - Icon LinkedIn
- [ ] `githubIcon` - Icon GitHub  
- [ ] `emailIcon` - Icon Email

### Decorative Elements
- [ ] `squersDecoration` - Decoration hình vuông
- [ ] `blurGradient` - Gradient blur
- [ ] `linesDecoration` - Decoration đường thẳng

### Skills Section
- [ ] `skillsCirclesBg` - Background hình tròn cho skills
- [ ] `sqlLogo` - Logo SQL
- [ ] `excelLogo` - Logo Excel
- [ ] `powerBILogo` - Logo Power BI
- [ ] `tableauLogo` - Logo Tableau
- [ ] `jiraLogo` - Logo Jira

### Decorative Vectors
- [ ] `wavyVector1` - Vector sóng 1
- [ ] `wavyVector2` - Vector sóng 2
- [ ] `wavyVector3` - Vector sóng 3

### Ellipse Shapes
- [ ] `ellipse2179` - Hình ellipse 2179
- [ ] `ellipse2180` - Hình ellipse 2180
- [ ] `ellipse2181` - Hình ellipse 2181

## Lưu ý

- **Social Icons**: Hiện tại đang dùng React Icons làm fallback, nên vẫn hiển thị được
- **Decorative Images**: Các ảnh trang trí sẽ tự ẩn nếu lỗi, không ảnh hưởng đến layout chính
- **Skills Logos**: Cần thay thế để hiển thị đúng logo các công cụ

## Test sau khi cập nhật

1. Chạy `npm run dev`
2. Kiểm tra từng section:
   - Hero section: Social icons, decorative images
   - Skills section: Logos
   - Portfolio section: Ellipse decorations
   - CTA section: Wavy vectors
3. Mở DevTools → Network tab để kiểm tra ảnh có load được không

