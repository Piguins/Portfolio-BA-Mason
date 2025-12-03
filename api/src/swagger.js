// Swagger/OpenAPI configuration
import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      license: {
        name: 'MIT',
      },
    },
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            slug: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string', nullable: true },
            summary: { type: 'string', nullable: true },
            content: { type: 'string', nullable: true },
            hero_image_url: { type: 'string', nullable: true },
            case_study_url: { type: 'string', nullable: true },
            external_url: { type: 'string', nullable: true },
            order_index: { type: 'integer' },
            is_published: { type: 'boolean' },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  color: { type: 'string' },
                },
              },
            },
          },
        },
        Skill: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            category: { type: 'string' },
            level: { type: 'integer', minimum: 1, maximum: 5 },
            icon_url: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            order_index: { type: 'integer' },
            is_highlight: { type: 'boolean' },
          },
        },
        Experience: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            company: { type: 'string' },
            role: { type: 'string' },
            location: { type: 'string', nullable: true },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date', nullable: true },
            is_current: { type: 'boolean' },
            description: { type: 'string', nullable: true },
            bullets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  text: { type: 'string' },
                  order_index: { type: 'integer' },
                },
              },
            },
            skills_used: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  slug: { type: 'string' },
                  icon_url: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
      },
    },
    servers: [
      {
        url: 'https://api.mason.id.vn',
        description: 'Production API (Custom Domain)',
      },
      {
        url: 'https://portfolioapi-brown.vercel.app',
        description: 'Production server (Vercel)',
      },
      {
        url: process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : process.env.API_URL || 'http://localhost:4000',
        description: 'Current server',
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
  apis: [
    path.join(__dirname, 'index.js'),
    path.join(__dirname, 'routes', '*.js'),
    path.join(__dirname, 'controllers', '*.js'),
    path.join(__dirname, 'services', '*.js'),
  ],
}

export const swaggerSpec = swaggerJsdoc(options)

