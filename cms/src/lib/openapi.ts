// OpenAPI/Swagger specification for CMS API routes
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Mason Portfolio CMS API',
    version: '1.0.0',
    description:
      'API endpoints for managing Portfolio content (Hero, Specializations, Experience, Portfolio)',
    contact: {
      name: 'Mason',
      url: 'https://github.com/Piguins/Portfolio-BA-Mason',
    },
  },
  servers: [
    {
      url:
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'https://admin.mason.id.vn',
      description: 'CMS API Server',
    },
  ],
  tags: [
    { name: 'Hero', description: 'Hero section management (singleton)' },
    { name: 'Specializations', description: 'Specializations cards management' },
    { name: 'Experience', description: 'Work experience timeline management' },
    { name: 'Portfolio', description: 'Portfolio projects management' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from Supabase Auth',
      },
    },
    schemas: {
      HeroSection: {
        type: 'object',
        required: ['id', 'title', 'introduction'],
        properties: {
          id: { type: 'string', description: 'CUID identifier' },
          title: { type: 'string', example: "Hey I'm The Kiet" },
          introduction: { type: 'string', description: 'Bio text' },
          linkedinUrl: { type: 'string', nullable: true, format: 'uri' },
          email: { type: 'string', nullable: true, format: 'email' },
          githubUrl: { type: 'string', nullable: true, format: 'uri' },
          bannerUrl: { type: 'string', nullable: true, format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Specialization: {
        type: 'object',
        required: ['id', 'title'],
        properties: {
          id: { type: 'integer' },
          iconUrl: { type: 'string', nullable: true, format: 'uri' },
          title: { type: 'string', example: 'Business Analysis' },
          description: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Experience: {
        type: 'object',
        required: ['id', 'company', 'role', 'startDate'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          company: { type: 'string', example: 'Tech Corp' },
          role: { type: 'string', example: 'Business Analyst' },
          location: { type: 'string', nullable: true },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', nullable: true, format: 'date' },
          description: { type: 'string', nullable: true },
          bullets: { type: 'array', items: { type: 'string' } },
          skills: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Portfolio: {
        type: 'object',
        required: ['id', 'title', 'tagRole'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'E-commerce Platform' },
          tagRole: { type: 'string', example: 'Business Analyst' },
          description: { type: 'string', nullable: true },
          imageUrl: { type: 'string', nullable: true, format: 'uri' },
          projectUrl: { type: 'string', nullable: true, format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Error message' },
        },
      },
    },
  },
  paths: {
    '/api/hero': {
      get: {
        tags: ['Hero'],
        summary: 'Get hero section',
        description: 'Retrieve the hero section content (singleton)',
        responses: {
          '200': {
            description: 'Hero section retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HeroSection' },
              },
            },
          },
          '404': {
            description: 'Hero section not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Hero'],
        summary: 'Create hero section',
        description: 'Create a new hero section entry',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'introduction'],
                properties: {
                  title: { type: 'string' },
                  introduction: { type: 'string' },
                  linkedinUrl: { type: 'string', nullable: true },
                  email: { type: 'string', nullable: true },
                  githubUrl: { type: 'string', nullable: true },
                  bannerUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Hero section created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HeroSection' },
              },
            },
          },
          '400': {
            description: 'Invalid input',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Hero'],
        summary: 'Update hero section',
        description: 'Update the hero section content',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['id'],
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  introduction: { type: 'string' },
                  linkedinUrl: { type: 'string', nullable: true },
                  email: { type: 'string', nullable: true },
                  githubUrl: { type: 'string', nullable: true },
                  bannerUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Hero section updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HeroSection' },
              },
            },
          },
        },
      },
    },
    '/api/specializations': {
      get: {
        tags: ['Specializations'],
        summary: 'Get all specializations',
        description: 'Retrieve all specialization cards',
        responses: {
          '200': {
            description: 'List of specializations',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Specialization' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Specializations'],
        summary: 'Create specialization',
        description: 'Create a new specialization card',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  iconUrl: { type: 'string', nullable: true },
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Specialization created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Specialization' },
              },
            },
          },
        },
      },
    },
    '/api/specializations/{id}': {
      get: {
        tags: ['Specializations'],
        summary: 'Get specialization by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Specialization details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Specialization' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Specializations'],
        summary: 'Update specialization',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  iconUrl: { type: 'string', nullable: true },
                  title: { type: 'string' },
                  description: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Specialization updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Specialization' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Specializations'],
        summary: 'Delete specialization',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Specialization deleted successfully',
          },
        },
      },
    },
    '/api/experience': {
      get: {
        tags: ['Experience'],
        summary: 'Get all experiences',
        description: 'Retrieve all work experience entries',
        responses: {
          '200': {
            description: 'List of experiences',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Experience' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Experience'],
        summary: 'Create experience',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['company', 'role', 'startDate'],
                properties: {
                  company: { type: 'string' },
                  role: { type: 'string' },
                  location: { type: 'string', nullable: true },
                  startDate: { type: 'string', format: 'date' },
                  endDate: { type: 'string', nullable: true, format: 'date' },
                  description: { type: 'string', nullable: true },
                  bullets: { type: 'array', items: { type: 'string' } },
                  skills: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Experience created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Experience' },
              },
            },
          },
        },
      },
    },
    '/api/experience/{id}': {
      get: {
        tags: ['Experience'],
        summary: 'Get experience by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Experience details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Experience' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Experience'],
        summary: 'Update experience',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['company', 'role', 'startDate'],
                properties: {
                  company: { type: 'string' },
                  role: { type: 'string' },
                  location: { type: 'string', nullable: true },
                  startDate: { type: 'string', format: 'date' },
                  endDate: { type: 'string', nullable: true, format: 'date' },
                  description: { type: 'string', nullable: true },
                  bullets: { type: 'array', items: { type: 'string' } },
                  skills: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Experience updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Experience' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Experience'],
        summary: 'Delete experience',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Experience deleted successfully',
          },
        },
      },
    },
    '/api/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get all portfolio projects',
        responses: {
          '200': {
            description: 'List of portfolio projects',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Portfolio' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Portfolio'],
        summary: 'Create portfolio project',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'tagRole'],
                properties: {
                  title: { type: 'string' },
                  tagRole: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  imageUrl: { type: 'string', nullable: true },
                  projectUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Portfolio project created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Portfolio' },
              },
            },
          },
        },
      },
    },
    '/api/portfolio/{id}': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get portfolio project by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Portfolio project details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Portfolio' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Portfolio'],
        summary: 'Update portfolio project',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'tagRole'],
                properties: {
                  title: { type: 'string' },
                  tagRole: { type: 'string' },
                  description: { type: 'string', nullable: true },
                  imageUrl: { type: 'string', nullable: true },
                  projectUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Portfolio project updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Portfolio' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Portfolio'],
        summary: 'Delete portfolio project',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Portfolio project deleted successfully',
          },
        },
      },
    },
  },
}
