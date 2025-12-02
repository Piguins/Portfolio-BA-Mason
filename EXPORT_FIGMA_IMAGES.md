# Hướng dẫn Export Ảnh từ Figma

## Vấn đề
Các URL MCP Figma (`https://www.figma.com/api/mcp/asset/...`) không thể download trực tiếp vì cần authentication và chỉ hoạt động trong MCP context.

## Giải pháp: Export trực tiếp từ Figma

### Bước 1: Mở file Figma
1. Truy cập: https://www.figma.com/design/tewR8UyQkGNdxntLz0pPoY/Free-Designer-Portfolio-and-Webflow-Template--Community---Community-?node-id=1-3&m=dev
2. Đăng nhập vào Figma

### Bước 2: Export từng asset

#### Social Icons (LinkedIn, GitHub, Email)
1. Tìm các icon trong design (thường ở Hero section)
2. Click vào icon cần export
3. Ở panel bên phải, scroll xuống phần "Export"
4. Click "+" để thêm export setting
5. Chọn format: **PNG** hoặc **SVG**
6. Chọn size: **1x** hoặc **2x** (khuyến nghị 2x cho chất lượng tốt)
7. Click "Export [tên icon]"
8. Lưu file vào thư mục `public/images/` với tên:
   - `linkedin-icon.png`
   - `github-icon.png`
   - `email-icon.png`

#### Decorative Elements
- **squers-decoration**: Tìm element "squers - option 1" trong Hero section
- **blur-gradient**: Tìm "Blur Gradient" element
- **lines-decoration**: Tìm "Lines" decoration element

Export tương tự như trên, lưu với tên tương ứng.

#### Skills Logos
- **skills-circles-bg**: Background hình tròn
- **sql-logo**, **excel-logo**, **powerbi-logo**, **tableau-logo**, **jira-logo**: Các logo trong Skills section

#### Decorative Vectors
- **wavy-vector-1**, **wavy-vector-2**, **wavy-vector-3**: Các vector sóng trang trí

#### Ellipse Shapes
- **ellipse-2179**, **ellipse-2180**, **ellipse-2181**: Các hình ellipse trang trí

### Bước 3: Export hàng loạt (nếu có nhiều assets)

1. Chọn nhiều elements cùng lúc (giữ Shift + click)
2. Ở Export panel, thêm export settings cho tất cả
3. Click "Export" để export tất cả cùng lúc

### Bước 4: Upload lên CDN (Tùy chọn)

Nếu muốn host ảnh trên CDN thay vì local:
1. Upload ảnh lên [PostImg.cc](https://postimg.cc/) (giống heroImage)
2. Copy direct link
3. Cập nhật URL trong `src/constants/images.js`

## Mapping Assets từ Design Context

Dựa trên design context đã lấy được, đây là mapping:

| Asset ID | Tên file cần | Vị trí trong design |
|----------|--------------|---------------------|
| 1a5c91e4-05b6-4f1c-b017-5d1b229db165 | linkedin-icon.png | imgGroup838 (Hero buttons) |
| 721220bb-a01e-40f4-a159-539f6ef83725 | github-icon.png | imgGroup837 (Hero buttons) |
| 390c0629-2ae2-4b8c-a1dd-0806157bcd6d | email-icon.png | imgGroup836 (Hero buttons) |
| 70e9c2b9-bc6b-4065-a108-ae3c6ca5d05b | squers-decoration.png | imgSquersOption1 |
| 67142e2a-0d6b-4b27-bb3a-8a550704e5e2 | blur-gradient.png | imgBlurGradient |
| f7cc3815-2f59-445b-90a6-5f119094899c | lines-decoration.png | imgLines |
| e9cafdee-8126-4649-8e35-dba9b949131d | skills-circles-bg.png | imgCircles |
| 951cb9b1-7595-480b-9cc6-422c1cefb807 | sql-logo.png | imgEllipse2163 |
| e08c951e-a1ec-4f3c-9b8a-003b63aaae39 | excel-logo.png | imgEllipse2164 |
| 5ab7ec9d-8a45-4a63-843d-0ef2ae23f41f | powerbi-logo.png | imgEllipse2165 |
| a10f4beb-5941-4b34-9c46-a78b37d90383 | tableau-logo.png | imgEllipse2168 |
| 0eac62da-c492-45f3-b3f5-98eb76af38cc | jira-logo.png | imgEllipse2166/2167 |
| 5fad9893-075f-4b4f-bb01-50331a346f59 | wavy-vector-1.png | Vector pattern 1 |
| 15f7e586-9700-4578-bbb2-be0ddde21619 | wavy-vector-2.png | Vector pattern 2 |
| f1adc080-14a0-4fc9-964e-67a4e2604f1e | wavy-vector-3.png | Vector pattern 3 |
| 5c175357-e4ba-4f7a-87b8-fe4f1ee903bb | ellipse-2179.png | imgEllipse2179 |
| d80e4665-6ef7-4c00-be22-488aeb44f472 | ellipse-2180.png | imgEllipse2180 |
| d85214a6-28cd-465b-b1d7-d5b882912844 | ellipse-2181.png | imgEllipse2181 |

## Sau khi export xong

Cập nhật file `src/constants/images.js` với các đường dẫn local:
```javascript
linkedinIcon: "/images/linkedin-icon.png",
githubIcon: "/images/github-icon.png",
// ... etc
```

