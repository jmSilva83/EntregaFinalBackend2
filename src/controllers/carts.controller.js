import { productsService, TicketsService } from '../services/services.js';
import { v4 as uuidv4 } from 'uuid';
import cartsService from '../services/CartServices.js';
import ticketsService from '../services/ticketService.js';

const getAllCarts = async (req, res) => {
    try {
        const carts = await cartsService.getAllCarts(); 
        res.status(200).json({ status: 'success', data: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService
        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }
        res.status(200).json({ status: 'success', data: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const createCart = async (req, res) => {
    try {
        const newCart = await cartsService.createCart(); // Asegúrate de que este método exista en CartService
        res.status(201).json({ status: 'success', data: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be greater than zero',
            });
        }

        const cart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService
        const product = await productsService.getById(pid);

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }
        if (!product) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Product not found' });
        }

        await cartsService.addProductToCart(cid, pid, quantity); // Asegúrate de que este método exista en CartService

        const updatedCart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService
        res.status(200).json({
            status: 'success',
            message: 'Product added successfully',
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be greater than zero',
            });
        }

        const cart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService
        const product = await productsService.getById(pid);

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }
        if (!product) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Product not found' });
        }

        const updatedCart = await cartsService.updateProductQuantity(
            cid,
            pid,
            quantity
        ); // Asegúrate de que este método exista en CartService
        res.status(200).json({
            status: 'success',
            message: 'Product quantity updated successfully',
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const updateCartProducts = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        const updatedCart = await cartsService.updateCartProducts(
            cid,
            products
        ); // Asegúrate de que este método exista en CartService
        res.status(200).json({
            status: 'success',
            message: 'Cart products updated successfully',
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        const updatedCart = await cartsService.removeProductFromCart(cid, pid); // Asegúrate de que este método exista en CartService
        res.status(200).json({
            status: 'success',
            message: 'Product removed successfully',
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const clearCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartsService.getCartById(cid); // Asegúrate de que este método exista en CartService

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        await cartsService.clearCart(cid); // Asegúrate de que este método exista en CartService
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const purchaseCart = async (req, res) => {
    const purchaserId = req.user.id;

    try {
        const purchaser = await userService.getUser(purchaserId);
        if (!purchaser || !purchaser.email) {
            return res.status(404).json({ status: "error", message: "Couldn't complete purchase" });
        }
        const email = purchaser.email;

        const cartId = req.params.cid;
        const cart = await cartsService.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Cart not found" });
        }

        const cartProducts = cart.products;
        const inStock = [];
        const outOfStock = [];

        // Verificar el stock de los productos
        for (const item of cartProducts) {
            const product = await productsService.getCartById(item.productId);
            if (!product) {
                outOfStock.push({ id: item.product, quantity: item.quantity, available: 0 });
                continue;
            }

            if (product.stock >= item.quantity) {
                inStock.push({
                    id: product._id,
                    total: product.price * item.quantity,
                    quantity: item.quantity,
                    stock: product.stock,
                });
            } else {
                outOfStock.push({
                    id: product._id,
                    quantity: item.quantity,
                    available: product.stock,
                });
            }
        }

        if (outOfStock.length > 0) {
            return res.status(406).json({
                status: "error",
                message: "Some products are out of stock",
                payload: outOfStock,
            });
        }

        if (inStock.length === 0) {
            return res.status(406).json({
                status: "error",
                message: "Your cart is empty",
            });
        }

        const totalAmount = inStock.reduce((sum, product) => sum + product.total, 0);
        const purchaseInfo = {
            amount: totalAmount,
            purchaser: email,
            purchaseDatetime: new Date().toISOString(),
            code: uuidv4(),
        };

        const ticket = await ticketsService.createTicket(purchaseInfo);

        for (const product of inStock) {
            const newStock = product.stock - product.quantity;
            await productsService.updateStock(product.id, newStock);
        }

        await cartsService.clearCart(cartId);

        res.status(201).json({
            status: "success",
            message: "Purchase completed successfully",
            payload: ticket,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export default {
    getAllCarts,
    getCartById,
    createCart,
    addProductToCart,
    updateProductQuantity,
    updateCartProducts,
    removeProductFromCart,
    clearCart,
    purchaseCart,
};
