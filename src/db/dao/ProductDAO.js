import productModel from './models/product.model.js';

class ProductDAO {
    async find(query) {
        return productModel.find(query);
    }

    async findById(id) {
        return productModel.findById(id);
    }

    async create(data) {
        return productModel.create(data);
    }

    async update(id, data) {
        return productModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return productModel.findByIdAndDelete(id);
    }

    async count(query) {
        return productModel.countDocuments(query);
    }
}

export default new ProductDAO();
