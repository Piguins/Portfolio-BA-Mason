# Portfolio Website - Business Analyst

Professional portfolio website built with React JS for Business Analyst.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Customization](#customization)
8. [Deployment](#deployment)
9. [License](#license)
10. [Author](#author)

## Introduction

This is a professional portfolio website designed and developed specifically for Business Analyst. The website is built with React JS and Vite, ensuring high performance and excellent user experience.

The website is designed with a modern style, responsive on all devices, and optimized for SEO. The entire interface is built with plain CSS using custom properties, without using heavy CSS frameworks.

## Features

- Modern and responsive interface, compatible with all screen sizes
- Optimized for mobile devices with smooth experience
- Beautiful design with animations and transitions
- Single-page application (SPA) with smooth scrolling
- Well-organized code structure, easy to maintain
- Performance optimized with Vite build tool
- Automatic deployment to Vercel when pushing code to GitHub

## Technologies Used

- **React 18.2.0** - JavaScript library for building user interfaces
- **Vite 5.0.8** - Fast and efficient build tool
- **React Icons 4.12.0** - Icon library for React
- **CSS3** - Plain CSS with custom properties (CSS variables) for theme management

## Installation

### System Requirements

- Node.js version 16 or higher
- npm or yarn

### Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/Piguins/Portfolio-BA-Mason.git
cd Portfolio-BA-Mason
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

The website will run at `http://localhost:3000`

4. Build for production:

```bash
npm run build
```

Built files will be in the `dist/` directory

5. Preview production build:

```bash
npm run preview
```

## Project Structure

```
Portfolio-BA-Mason/
├── src/
│   ├── components/          # Shared components
│   │   ├── Navbar/          # Navigation bar
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   └── index.js     # Barrel export
│   │   └── Footer/          # Footer component
│   │       ├── Footer.jsx
│   │       ├── Footer.css
│   │       └── index.js
│   ├── pages/               # Website sections
│   │   ├── Home/            # Home page container
│   │   ├── Hero/            # Hero section
│   │   ├── Skills/          # Skills section
│   │   ├── Portfolio/       # Portfolio section
│   │   ├── Reviews/         # Reviews section
│   │   ├── FAQ/             # FAQ section
│   │   └── CTA/             # Call-to-action section
│   ├── constants/           # Constants
│   │   └── images.js        # Centralized image URLs management
│   ├── App.jsx              # Main App component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles and CSS variables
├── public/                  # Static files
│   └── .htaccess            # Apache configuration (if needed)
├── document/                # Documentation
│   └── VERCEL_SETUP.md      # Vercel setup guide
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel configuration
└── README.md                # This file
```

## Usage

### Development

After installing dependencies, run the following command to start the development server:

```bash
npm run dev
```

The development server will automatically reload when you change the code.

### Production Build

To build the project for production:

```bash
npm run build
```

The build result will be in the `dist/` directory, ready to deploy to hosting.

## Customization

### Change Personal Information

Website sections can be customized through the following files:

1. **Hero Section** - Main introduction information:
   - File: `src/pages/Hero/Hero.jsx`
   - Styles: `src/pages/Hero/Hero.css`

2. **Skills Section** - Skills and technologies:
   - File: `src/pages/Skills/Skills.jsx`
   - Styles: `src/pages/Skills/Skills.css`

3. **Portfolio Section** - Completed projects:
   - File: `src/pages/Portfolio/Portfolio.jsx`
   - Styles: `src/pages/Portfolio/Portfolio.css`

4. **Reviews Section** - Client reviews:
   - File: `src/pages/Reviews/Reviews.jsx`
   - Styles: `src/pages/Reviews/Reviews.css`

5. **FAQ Section** - Frequently asked questions:
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

### Change Images

All image URLs are centrally managed in the file `src/constants/images.js`. To change images, simply edit this file:

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

### Change Colors and Theme

Website colors are managed through CSS variables in the file `src/index.css`:

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

Changing these values will update the colors throughout the entire website.

### Change Fonts

Fonts are imported from Google Fonts in the file `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
```

Fonts are used through CSS variables:

```css
:root {
  --font-primary: 'Manrope', sans-serif;
  --font-secondary: 'Roboto', sans-serif;
}
```

## Deployment

### Deploy to Vercel (Recommended)

The website is pre-configured to deploy to Vercel. Vercel provides:

- Free for personal projects
- Automatic deployment when pushing code to GitHub
- Automatic HTTPS
- Global CDN
- Custom domain support

#### Deployment Steps:

1. Sign up for an account at [Vercel](https://vercel.com)
2. Import project from GitHub repository
3. Vercel will automatically detect configuration from `vercel.json`
4. After deployment, add custom domain (if available)
5. Every time you push code to GitHub, the website will automatically deploy

See detailed guide at: [document/VERCEL_SETUP.md](./document/VERCEL_SETUP.md)

### Deploy to Other Hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload all contents in the `dist/` directory to hosting
3. Configure web server to support SPA routing (see `public/.htaccess` file for Apache)

### GitHub Repository

Current repository: `https://github.com/Piguins/Portfolio-BA-Mason`

## License

MIT License

You are free to use, modify, and distribute this code for personal or commercial purposes.

## Author

**Mason** - Business Analyst

---

Project built with React and Vite.

