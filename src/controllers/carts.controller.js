import { productsService } from '../services/services.js';
import { v4 as uuidv4 } from 'uuid';
import cartServices from '../services/CartServices.js';
import ticketsService from '../services/ticketService.js';
import { usersService } from '../services/services.js';
import mongoose from 'mongoose';

const getAllCarts = async (req, res) => {
    try {
        const carts = await cartServices.getAllCarts();
        res.status(200).json({ status: 'success', data: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartServices.getCartById(cid);
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
        const newCart = await cartServices.createCart();
        res.status(201).json({ status: 'success', data: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        if (
            !mongoose.Types.ObjectId.isValid(cid) ||
            !mongoose.Types.ObjectId.isValid(pid)
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid cart or product ID',
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantity must be greater than zero',
            });
        }

        const cart = await cartServices.getCartById(
            new mongoose.Types.ObjectId(cid)
        );
        const product = await productsService.findById(
            new mongoose.Types.ObjectId(pid)
        );
        console.log(product.stock);

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

        const existingProductInCart = cart.products.find(
            (p) => p.product.toString() === pid.toString()
        );
        const quantityInCart = existingProductInCart
            ? existingProductInCart.quantity
            : 0;

        const availableStock = product.stock - quantityInCart;

        if (quantity > availableStock) {
            return res.status(400).json({
                status: 'error',
                message: `Not enough stock. Only ${availableStock} units available.`,
            });
        }

        if (existingProductInCart) {
            existingProductInCart.quantity += quantity;
        } else {
            cart.products.push({
                product: new mongoose.Types.ObjectId(pid),
                quantity,
            });
        }

        await cart.save();

        product.stock -= quantity;
        await product.save();

        const updatedCart = await cartServices.getCartById(cid);

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

        const cart = await cartServices.getCartById(cid);
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

        const updatedCart = await cartServices.updateProductQuantity(
            cid,
            pid,
            quantity
        );
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
        const cart = await cartServices.getCartById(cid);

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        const updatedCart = await cartServices.updateCartProducts(
            cid,
            products
        );
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
        const cart = await cartServices.getCartById(cid);

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        const updatedCart = await cartServices.removeProductFromCart(cid, pid);
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
        const cart = await cartServices.getCartById(cid);

        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        await cartServices.clearCart(cid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const purchaseCart = async (req, res) => {
    const purchaserId = req.user.id;

    try {
        const purchaser = await usersService.getById(purchaserId);
        if (!purchaser || !purchaser.email) {
            return res.status(404).json({
                status: 'error',
                message: "Couldn't complete purchase",
            });
        }
        const email = purchaser.email;

        const cartId = req.params.cid;
        const cart = await cartServices.getCartById(cartId);
        if (!cart) {
            return res
                .status(404)
                .json({ status: 'error', message: 'Cart not found' });
        }

        const cartProducts = cart.products;
        const inStock = [];
        const outOfStock = [];

        for (const item of cartProducts) {
            const product = await productsService.findById(item.product);
            console.log(product.stock);

            if (!product) {
                outOfStock.push({
                    id: item.product,
                    quantity: item.quantity,
                    available: 0,
                });
                continue;
            }

            if (product.stock >= item.quantity) {
                inStock.push({
                    id: product._id,
                    total: product.price * item.quantity,
                    quantity: item.quantity,
                    stock: product.stock,
                });
                await productsService.update(
                    product._id,
                    product.stock - item.quantity
                );
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
                status: 'error',
                message: 'Some products are out of stock',
                payload: outOfStock,
            });
        }

        if (inStock.length === 0) {
            return res.status(406).json({
                status: 'error',
                message: 'Your cart is empty',
            });
        }

        const totalAmount = inStock.reduce(
            (sum, product) => sum + product.total,
            0
        );
        const purchaseInfo = {
            amount: totalAmount,
            purchaser: email,
            purchaseDatetime: new Date().toISOString(),
            code: uuidv4(),
        };

        const ticket = await ticketsService.createTicket(purchaseInfo);

        const remainingProducts = cartProducts.filter(
            (item) =>
                !inStock.some(
                    (stockItem) =>
                        stockItem.id.toString() === item.product.toString()
                )
        );
        console.log(remainingProducts);
        await cartServices.updateCartProducts(cartId, remainingProducts);

        res.status(201).json({
            status: 'success',
            message: 'Purchase completed successfully',
            payload: {
                ticket,
                outOfStock,
            },
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
