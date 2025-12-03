// Swagger/OpenAPI configuration
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mason Portfolio API',
      version: '1.0.0',
      description: 'Backend API for Mason Portfolio website - Business Analyst Portfolio',
      contact: {
        name: 'Mason',
        url: 'https://github.com/Piguins/Portfolio-BA-Mason',
      },
    },
    servers: [
      {
        url: process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : process.env.API_URL || 'http://localhost:4000',
        description: 'Current server',
      },
      {
        url: 'https://portfolioapi-brown.vercel.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Projects',
        description: 'Portfolio projects endpoints',
      },
      {
        name: 'Skills',
        description: 'Skills and tools endpoints',
      },
      {
        name: 'Experience',
        description: 'Work experience endpoints',
      },
    ],
  },
  apis: ['./src/index.js'], // Path to the API files
}

export const swaggerSpec = swaggerJsdoc(options)

