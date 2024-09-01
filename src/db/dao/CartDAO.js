import cartModel from '../mongo/models/cart.model.js';

class CartDAO {
    async find(query) {
        return cartModel.find(query).populate('products.product');
    }

    async findById(id) {
        return cartModel.findById(id).populate('products.product');
    }

    async create(data = { products: [] }) {
        return cartModel.create(data);
    }

    async update(id, data) {
        return cartModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return cartModel.findByIdAndDelete(id);
    }

    async addProductToCart(cid, product) {
        return cartModel.findByIdAndUpdate(
            cid,
            { $push: { products: product } },
            { new: true }
        );
    }

    async updateProductQuantity(cid, pid, quantity) {
        return cartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
    }

    async updateCartProducts(cid, products) {
        return cartModel.findByIdAndUpdate(cid, { products }, { new: true });
    }

    async removeProductFromCart(cid, pid) {
        return cartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );
    }

    async clearCart(cid) {
        return cartModel.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        );
    }
}

export default new CartDAO();
