import CartDAO from '../db/dao/CartDAO.js';
import productModel from '../db/mongo/models/product.model.js';
import { v4 as uuidv4 } from 'uuid';

const getAllCarts = async (req, res) => {
    try {
        const carts = await CartDAO.find({});
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartDAO.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCart = async (req, res) => {
    try {
        const newCart = await CartDAO.create();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than zero' });
        }

        const cart = await CartDAO.findById(cid);
        const product = await productModel.findById(pid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const existingProduct = cart.products.find((p) => p.product.toString() === pid);
        if (existingProduct) {
            await CartDAO.updateProductQuantity(cid, pid, existingProduct.quantity + quantity);
        } else {
            await CartDAO.addProductToCart(cid, { product: pid, quantity });
        }

        const updatedCart = await CartDAO.findById(cid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than zero' });
        }

        const cart = await CartDAO.findById(cid);
        const product = await productModel.findById(pid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedCart = await CartDAO.updateProductQuantity(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCartProducts = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await CartDAO.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const updatedCart = await CartDAO.updateCartProducts(cid, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const cart = await CartDAO.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const updatedCart = await CartDAO.removeProductFromCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clearCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartDAO.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        await CartDAO.clearCart(cid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const purchaseCart = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartDAO.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        let totalAmount = 0;
        const failedProducts = [];

        for (const item of cart.products) {
            const product = await productModel.findById(item.product);
            if (!product) {
                failedProducts.push(item.product);
                continue;
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                totalAmount += product.price * item.quantity;
            } else {
                failedProducts.push(item.product);
            }
        }

        if (totalAmount > 0) {
            const newTicket = new ticketModel({
                code: uuidv4(),
                amount: totalAmount,
                purchaser: req.user.email
            });

            await newTicket.save();
        }

        await CartDAO.updateCartProducts(cid, cart.products.filter(p => failedProducts.includes(p.product)));

        if (failedProducts.length > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Purchase completed with some products not available',
                failedProducts
            });
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Purchase completed successfully'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    purchaseCart
};

