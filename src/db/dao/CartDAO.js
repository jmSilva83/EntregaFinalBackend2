import cartModel from './models/cart.model.js';

class CartDAO {
    async find(query) {
        return cartModel.find(query);
    }

    async findById(id) {
        return cartModel.findById(id);
    }

    async create(data) {
        return cartModel.create(data);
    }

    async update(id, data) {
        return cartModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return cartModel.findByIdAndDelete(id);
    }
}

export default new CartDAO();
