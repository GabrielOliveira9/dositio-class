import { test, describe } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { build, options } from './app.js';

const testJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vYHN1AnpQpdig7rFNy7K3b8DKhAOpz70tB9blw7qvKs';

const postProductTest = {
    name: 'New Posted Product',
    qtd: 2,
    cat_id: '66270ac084ea3a78ac4cad6d'
}

const putProductTest = {
    name: 'This Product Has Been Updated'
}

const postCategoryTest = {
    name: 'New Category',
    img_url: 'http://cbissn.ibict.br/images/phocagallery/galeria2/thumbs/phoca_thumb_l_image03_grd.png'
}

const postUserTest = {
    name:'New User',
    password:'New Password'
}

const putCategoryTest = {
    name: 'This Category Has Been Updated',
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
        deepEqual(options.db_url, 'mongodb://127.0.0.1:27017/dositio');
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
                url: '/categories/662702a784ea3a78ac4cad5d/products'
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
                headers: {
                    'x-access-token': testJWT
                }
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

        test('# No Auth Token', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });

            const response = await app.inject({
                method: 'DELETE',
                url: '/products/662706b684ea3a78ac4cad64',
                headers:{

                }
            });

            equal(response.statusCode, 401);
        });
        
        test('# Invalid Auth Token', async(t) => {
            const app = await build(options);

            t.after(async() => {
                await app.close();
            });

            const response = await app.inject({
                method: 'DELETE',
                url: '/products/662706b684ea3a78ac4cad64',
                headers:{
                    'x-access-token': 'asjdhjaiosdj'
                }
            });

            equal(response.statusCode, 401);
        });

    });
});

describe('###Tests for Authenticated routes', async(t) => {
    
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
                    'x-access-token': testJWT
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
                url: '/products/662706b684ea3a78ac4cad64',
                headers: {
                    'x-access-token': testJWT
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
                url: '/products/6627108e84ea3a78ac4cad80',
                body: putProductTest,
                headers: {
                    'x-access-token': testJWT
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
                    'x-access-token': testJWT
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
                url: '/categories/662710f984ea3a78ac4cad82',
                headers: {
                    'x-access-token': testJWT
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
                url: '/categories/6627049b84ea3a78ac4cad5f',
                body: putCategoryTest,
                headers: {
                    'x-access-token': testJWT
                }
            });

            equal(response.statusCode, 204);
        });
    });
});