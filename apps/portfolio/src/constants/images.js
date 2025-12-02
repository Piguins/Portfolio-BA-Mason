/**
 * Image URLs Configuration
 * 
 * ⚠️ IMPORTANT: Figma MCP API endpoints không thể download trực tiếp.
 * 
 * Để sửa lỗi ảnh:
 * 1. Export ảnh từ Figma (xem file EXPORT_FIGMA_IMAGES.md)
 * 2. Lưu vào thư mục /public/images/
 * 3. Cập nhật các đường dẫn bên dưới
 * 
 * Format: "/images/tên-file.png" (cho ảnh trong /public folder)
 * Hoặc: "https://..." (cho ảnh trên CDN)
 */

export const IMAGES = {
  // Hero Section
  heroImage: "https://i.postimg.cc/prD89448/Untitled-design-(1).png",
  
  // Social Icons - Export từ Figma và lưu vào /public/images/
  // Hiện tại đang dùng React Icons làm fallback
  linkedinIcon: "/images/linkedin-icon.png", // TODO: Export từ Figma
  githubIcon: "/images/github-icon.png", // TODO: Export từ Figma
  emailIcon: "/images/email-icon.png", // TODO: Export từ Figma
  
  // Decorative Elements - Export từ Figma
  squersDecoration: "/images/squers-decoration.png", // TODO: Export từ Figma
  blurGradient: "/images/blur-gradient.png", // TODO: Export từ Figma
  linesDecoration: "/images/lines-decoration.png", // TODO: Export từ Figma
  
  // Skills Section - Export từ Figma hoặc download từ internet
  skillsCirclesBg: "/images/skills-circles-bg.png",
  sqlLogo: "/images/sql-logo.png", // TODO: Export từ Figma hoặc download
  excelLogo: "/images/excel-logo.png", // TODO: Export từ Figma hoặc download
  powerBILogo: "/images/powerbi-logo.png", // TODO: Export từ Figma hoặc download
  tableauLogo: "/images/tableau-logo.png", // TODO: Export từ Figma hoặc download
  jiraLogo: "/images/jira-logo.svg", // ✅ Downloaded
  figmaLogo: "/images/figma-logo.svg", // ✅ Downloaded
  postmanLogo: "/images/postman-logo.svg", // ✅ Downloaded
  postgresqlLogo: "/images/postgresql-logo.svg", // ✅ Downloaded
  metabaseLogo: "/images/metabase-logo.svg", // ✅ Downloaded
  
  // Decorative Vector Patterns - Export từ Figma
  wavyVector1: "/images/wavy-vector-1.png", // TODO: Export từ Figma
  wavyVector2: "/images/wavy-vector-2.png", // TODO: Export từ Figma
  wavyVector3: "/images/wavy-vector-3.png", // TODO: Export từ Figma
  
  // Decorative Ellipse Shapes - Export từ Figma
  ellipse2179: "/images/ellipse-2179.png", // TODO: Export từ Figma
  ellipse2180: "/images/ellipse-2180.png", // TODO: Export từ Figma
  ellipse2181: "/images/ellipse-2181.png", // TODO: Export từ Figma
}

