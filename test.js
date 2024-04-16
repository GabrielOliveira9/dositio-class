import { test, describe } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { build, options } from './app.js';

const postProductTest = {
    name: 'Product_name1',
    qtd: '2',
    cat_id: '1'
}

const postCategoryTest = {
    name: 'Category_name1',
    img_url: 'http://cbissn.ibict.br/images/phocagallery/galeria2/thumbs/phoca_thumb_l_image03_grd.png'
}

const postUserTest = {
    name:'Username1',
    password:'Password1'
}

describe('###Tests for Server Configuration', async(t) => {
    test('Testing options configuration file', async (t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        deepEqual(options.stage, 'test');
        deepEqual(options.port, '3000');
        deepEqual(options.host, '127.0.0.1');
        deepEqual(options.jwt_secret, 'Abcd@1234');
        deepEqual(options.db_url, 'mongodb://localhost:27017/dositio');
    });
});

describe('###Tests for Unauthenticated Routes', async(t) => {
    
    describe('##Success Requests', async(t) => {
        test('# GET /products', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/products'
            });
            
            equal(response.statusCode, 200);
        });
        
        test('# GET /categories', async(t) => {
            const app = await build(options);
            
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/categories'
            });
            
            equal(response.statusCode, 200);
        });
        
        test('# GET /categories/:id/products', async(t) => {
            const app = await build(options);
            
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'GET',
                url: '/categories/1/products'
            });
            
            equal(response.statusCode, 200);
        });
        
        test('# POST /register', async(t) => {
            const app = await build(options);
        
            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                body: postUserTest,
            });
            equal(response.statusCode, 201);
        });
    });

    describe('##Bad Requests', async(t) => {
        
        test('# Not found', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'GET',
                url: '/notfound'
            });
            equal(response.statusCode, 404);
        });
        
        test('# Error', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });

            const response = await app.inject({
                method: 'GET',
                url: '/error'
            });
            equal(response.statusCode, 501);
        });

    });
});

describe('###Tests for Authenticated routes', async(t) => {

    test('#Login and get JWT token', async(t) => {
        const app = await build(options);

        t.after(async() => {
            await app.close();
        });

        const userData = {
            username: 'testUser',
            password: 'testPassword'
        };

        const response = await app.inject({
            method: 'POST',
            url: '/auth',
            payload: userData
        });
        
        equal(response.statusCode, 200);
        
        const responseData = JSON.parse(response.body);
        const token = responseData['x-access-token'];
        
        t.context.token = token;
    });
    
    
    describe('##Success Requests', async(t) => {
        test('# POST /products', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/products',
                body: postProductTest,
                headers: {
                    authorization: `Bearer ${t.context.token}`
                }
            });

            equal(response.statusCode, 201);
        });

        test('# DELETE /products:id', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'DELETE',
                url: '/products/1',
                headers: {
                    authorization: `Bearer ${t.context.token}`
                }
            });

            equal(response.statusCode, 204);
        });
        
        test('# PUT /products:id', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'PUT',
                url: '/products/1',
                body: postProductTest,
                headers: {
                    authorization: `Bearer ${t.context.token}`
                }
            });

            equal(response.statusCode, 204);
        });

        test('# POST /categories', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'POST',
                url: '/categories',
                body: postCategoryTest,
                headers: {
                    authorization: `Bearer ${t.context.token}`
                }
            });
            equal(response.statusCode, 201);
        });

        test('# DELETE /categories:id', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'DELETE',
                url: '/categories/1',
                headers: {
                    authorization: `Bearer ${t.context.token}`
                }
            });

            equal(response.statusCode, 204);
        });

        test('# PUT /categories:id', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });
            const response = await app.inject({
                method: 'PUT',
                url: '/categories/1',
                body: postCategoryTest,
                headers: {
                    authorization: `Bearer ${t.context.token}`
                }
            });

            equal(response.statusCode, 204);
        });
    });
});