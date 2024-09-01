import CartManager from '../db/mongo/CartManager.js';
import cartModel from '../db/mongo/models/cart.model.js';

export class CartRepository {
    constructor() {
        this.cartManager = new CartManager();
    }

    async getAllCarts() {
        return this.cartManager.getAllCarts();
    }

    async getCartById(cartId) {
        return this.cartManager.getCartById(cartId);
    }

    async createCart(cartData) {
        return this.cartManager.createCart(cartData);
    }

    async addProductToCart(cartId, productData) {
        return this.cartManager.addProductToCart(cartId, productData);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return this.cartManager.updateProductQuantity(cartId, productId, quantity);
    }

    async updateCartProducts(cartId, products) {
        return this.cartManager.updateCartProducts(cartId, products);
    }

    async removeProductFromCart(cartId, productId) {
        return this.cartManager.removeProductFromCart(cartId, productId);
    }

    async clearCart(cartId) {
        return this.cartManager.clearCart(cartId);
    }

    async purchaseCart(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) throw new Error('Cart not found');

        // Implement purchase logic here
        // This should include stock verification, updating product quantities, and creating a ticket

        return cart;
    }
}
