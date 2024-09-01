import ProductDAO from '../dao/ProductDAO.js';

class ProductRepository {
    async getAll(query) {
        return ProductDAO.find(query);
    }

    async getById(id) {
        return ProductDAO.findById(id);
    }

    async create(product) {
        return ProductDAO.create(product);
    }

    async update(id, data) {
        return ProductDAO.update(id, data);
    }

    async delete(id) {
        return ProductDAO.delete(id);
    }

    async count(query) {
        return ProductDAO.count(query);
    }
}

export default new ProductRepository();
