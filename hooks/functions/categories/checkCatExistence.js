import { ALREADY_EXISTS } from "../../../libs/errors.js";
export const checkCatExistence = (app) => async (request, reply) => {
    const categories = app.mongo.db.collection('categories');

    let category = request.body;

    let result = await categories.count({name: category.name});

    if(result > 0) throw new ALREADY_EXISTS();
}