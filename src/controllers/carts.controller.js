// import CartManager from '../db/mongo/CartManager.js';
// import productModel from '../db/mongo/models/product.model.js';

// const cartManager = new CartManager();

// const getAllCarts = async (req, res) => {
//     try {
//         const carts = await cartManager.getAllCarts();
//         res.json(carts);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const getCartById = async (req, res) => {
//     const { cid } = req.params;
//     try {
//         const cart = await cartManager.getCartById(cid);
//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }
//         res.json(cart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const createCart = async (req, res) => {
//     try {
//         const newCart = await cartManager.createCart();
//         res.status(201).json(newCart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const addProductToCart = async (req, res) => {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body;

//     try {
//         // Validar cantidad
//         if (quantity <= 0) {
//             return res
//                 .status(400)
//                 .json({ error: 'Quantity must be greater than zero' });
//         }

//         // Validar existencia del carrito y del producto
//         const cart = await cartManager.getCartById(cid);
//         const product = await productModel.findById(pid);

//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }
//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         // Verificar si el producto ya está en el carrito
//         const existingProduct = cart.products.find(
//             (p) => p.product.toString() === pid
//         );
//         if (existingProduct) {
//             // Actualizar cantidad si el producto ya está en el carrito
//             await cartManager.updateProductQuantity(
//                 cid,
//                 pid,
//                 existingProduct.quantity + quantity
//             );
//         } else {
//             // Añadir producto al carrito
//             await cartManager.addProductToCart(cid, { product: pid, quantity });
//         }

//         const updatedCart = await cartManager.getCartById(cid);
//         res.status(200).json(updatedCart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const updateProductQuantity = async (req, res) => {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body;

//     try {
//         // Validar cantidad
//         if (quantity <= 0) {
//             return res
//                 .status(400)
//                 .json({ error: 'Quantity must be greater than zero' });
//         }

//         // Validar existencia del carrito y del producto
//         const cart = await cartManager.getCartById(cid);
//         const product = await productModel.findById(pid);

//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }
//         if (!product) {
//             return res.status(404).json({ error: 'Product not found' });
//         }

//         // Actualizar cantidad del producto en el carrito
//         const updatedCart = await cartManager.updateProductQuantity(
//             cid,
//             pid,
//             quantity
//         );
//         res.status(200).json(updatedCart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const updateCartProducts = async (req, res) => {
//     const { cid } = req.params;
//     const { products } = req.body;

//     try {
//         // Validar existencia del carrito
//         const cart = await cartManager.getCartById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         // Actualizar productos del carrito
//         const updatedCart = await cartManager.updateCartProducts(cid, products);
//         res.status(200).json(updatedCart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const removeProductFromCart = async (req, res) => {
//     const { cid, pid } = req.params;

//     try {
//         // Validar existencia del carrito
//         const cart = await cartManager.getCartById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         // Eliminar producto del carrito
//         const updatedCart = await cartManager.removeProductFromCart(cid, pid);
//         res.status(200).json(updatedCart);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// const clearCart = async (req, res) => {
//     const { cid } = req.params;

//     try {
//         // Validar existencia del carrito
//         const cart = await cartManager.getCartById(cid);

//         if (!cart) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         // Limpiar carrito
//         await cartManager.clearCart(cid);
//         res.status(204).end();
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Exportaciones
// export default {
//     getAllCarts,
//     getCartById,
//     createCart,
//     addProductToCart,
//     updateProductQuantity,
//     updateCartProducts,
//     removeProductFromCart,
//     clearCart
// };

import { v4 as uuidv4 } from 'uuid'; // Agrega esta línea al inicio del archivo
import CartManager from '../db/mongo/CartManager.js';
import productModel from '../db/mongo/models/product.model.js';
import ticketModel from '../db/mongo/models/ticket.model.js'; // Asegúrate de que la ruta sea correcta

const cartManager = new CartManager();

const getAllCarts = async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
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
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        // Validar cantidad
        if (quantity <= 0) {
            return res
                .status(400)
                .json({ error: 'Quantity must be greater than zero' });
        }

        // Validar existencia del carrito y del producto
        const cart = await cartManager.getCartById(cid);
        const product = await productModel.findById(pid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find(
            (p) => p.product.toString() === pid
        );
        if (existingProduct) {
            // Actualizar cantidad si el producto ya está en el carrito
            await cartManager.updateProductQuantity(
                cid,
                pid,
                existingProduct.quantity + quantity
            );
        } else {
            // Añadir producto al carrito
            await cartManager.addProductToCart(cid, { product: pid, quantity });
        }

        const updatedCart = await cartManager.getCartById(cid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        // Validar cantidad
        if (quantity <= 0) {
            return res
                .status(400)
                .json({ error: 'Quantity must be greater than zero' });
        }

        // Validar existencia del carrito y del producto
        const cart = await cartManager.getCartById(cid);
        const product = await productModel.findById(pid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Actualizar cantidad del producto en el carrito
        const updatedCart = await cartManager.updateProductQuantity(
            cid,
            pid,
            quantity
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCartProducts = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        // Validar existencia del carrito
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Actualizar productos del carrito
        const updatedCart = await cartManager.updateCartProducts(cid, products);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        // Validar existencia del carrito
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Eliminar producto del carrito
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const clearCart = async (req, res) => {
    const { cid } = req.params;

    try {
        // Validar existencia del carrito
        const cart = await cartManager.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Limpiar carrito
        await cartManager.clearCart(cid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para finalizar la compra
const purchaseCart = async (req, res) => {
    const { cid } = req.params;

    try {
        // Obtener el carrito
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Inicializar el monto total y el arreglo de productos no procesados
        let totalAmount = 0;
        const failedProducts = [];

        // Procesar cada producto en el carrito
        for (const item of cart.products) {
            const product = await productModel.findById(item.product);
            if (!product) {
                failedProducts.push(item.product);
                continue;
            }

            if (product.stock >= item.quantity) {
                // Reducir el stock del producto
                product.stock -= item.quantity;
                await product.save();

                // Incrementar el monto total
                totalAmount += product.price * item.quantity;
            } else {
                // Si no hay suficiente stock, agregar el producto al arreglo de fallos
                failedProducts.push(item.product);
            }
        }

        // Crear un ticket solo si hay productos que se compraron exitosamente
        if (totalAmount > 0) {
            const newTicket = new ticketModel({
                code: uuidv4(), // Genera un código único para el ticket
                amount: totalAmount,
                purchaser: req.user.email // Asumiendo que el correo del usuario está en req.user
            });

            await newTicket.save();
        }

        // Actualizar el carrito para solo contener productos fallidos
        await cartManager.updateCartProducts(cid, cart.products.filter(p => failedProducts.includes(p.product)));

        // Responder con el resultado de la compra
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

// Exportaciones
export default {
    getAllCarts,
    getCartById,
    createCart,
    addProductToCart,
    updateProductQuantity,
    updateCartProducts,
    removeProductFromCart,
    clearCart,
    purchaseCart // Agrega esta línea
};
