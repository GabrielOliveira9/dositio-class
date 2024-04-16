/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';

export default async function register(app, options){
    const users = app.mongo.db.collection('users');

    const InvalidUserError = createError('InvalidUserError', 'Usuário Inválido.', 400);

    app.post('/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['name', 'password']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let user = request.body;

        await users.insertOne(user);

        return reply.code(201).send();
    });
}