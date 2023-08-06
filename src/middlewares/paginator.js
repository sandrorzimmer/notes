import BadRequest from '../errors/BadRequest.js';

async function paginate(req, res, next) {
    try {
        let { limit = 10, page = 1, sortBy = '_id:1' } = req.query;
        let [sortField, sortOrder] = sortBy.split(':');

        limit = parseInt(limit, 10);
        page = parseInt(page, 10);
        sortOrder = parseInt(sortOrder, 10);

        const { result } = req;

        if (limit > 0 && page > 0) {
            const paginatedResult = await result.find({})
                .sort({ [sortField]: sortOrder })
                .skip((page - 1) * limit)
                .limit(limit);
            res.status(200).json(paginatedResult);
        } else {
            next(new BadRequest());
        }
    } catch (error) {
        next(error);
    }
}

export default paginate;
