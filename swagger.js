const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Tâches API',
    version: '1.0.0',
    description: 'Une API pour gérer les tâches',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['index.js'],
};

const tags = [
  {
    name: 'tâches',
    description: 'Gestion des tâches',
  },
];

const paths = {
  '/tasks': {
    get: {
      summary: 'Récupérer la liste des tâches',
      tags: ['tâches'],
      responses: {
        200: {
          description: 'Liste des tâches',
        },
      },
    },
    post: {
      summary: 'Ajouter une tâche',
      tags: ['tâches'],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                status: {
                  type: 'string',
                },
              },
              required: ['title', 'description', 'status'],
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Tâche ajoutée avec succès',
        },
      },
    },
  },
  '/tasks/{id}': {
    get: {
      summary: 'Récupérer une tâche par son ID',
      tags: ['tâches'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID de la tâche',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Tâche trouvée',
        },
      },
    },
    put: {
      summary: 'Mettre à jour une tâche par son ID',
      tags: ['tâches'],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'ID de la tâche'
        }
    ]
},
delete:{
        summary: 'Supprimer  une tâche par son ID',
        tags: ['tâches'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID de la tâche',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Tâche supprimé',
          },
        }
  }
}
}