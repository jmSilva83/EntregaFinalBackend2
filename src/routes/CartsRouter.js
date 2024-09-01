// import BaseRouter from '../routes/BaseRouter.js';
// import { cartService } from '../db/index.js';

// export default class CartsRouter extends BaseRouter {
//     initializeRoutes() {
//         this.get('/carts', ['AUTHORIZED'], this.getAllCarts);
//         this.get('/carts/:cid', ['AUTHORIZED'], this.getCartById);
//         this.post('/carts', ['AUTHORIZED'], this.createCart);
//         this.post(
//             '/carts/:cid/products/:pid',
//             ['AUTHORIZED'],
//             this.addProductToCart
//         );
//         this.put(
//             '/carts/:cid/products/:pid',
//             ['AUTHORIZED'],
//             this.updateProductQuantity
//         );
//         this.put('/carts/:cid', ['AUTHORIZED'], this.updateCartProducts);
//         this.delete(
//             '/carts/:cid/products/:pid',
//             ['AUTHORIZED'],
//             this.removeProductFromCart
//         );
//         this.delete('/carts/:cid', ['AUTHORIZED'], this.clearCart);
//     }

//     getAllCarts = async (req, res, next) => {
//         try {
//             const carts = await cartService.getAllCarts();
//             res.json(carts);
//         } catch (error) {
//             next(error);
//         }
//     };

//     getCartById = async (req, res, next) => {
//         try {
//             const { cid } = req.params;
//             const cart = await cartService.getCartById(cid);
//             res.json(cart);
//         } catch (error) {
//             next(error);
//         }
//     };

//     createCart = async (req, res, next) => {
//         try {
//             const cart = await cartService.createCart(req.body);
//             res.status(201).json(cart);
//         } catch (error) {
//             next(error);
//         }
//     };

//     addProductToCart = async (req, res, next) => {
//         try {
//             const { cid, pid } = req.params;
//             const { quantity } = req.body;
//             const updatedCart = await cartService.addProductToCart(
//                 cid,
//                 pid,
//                 quantity
//             );
//             res.json(updatedCart);
//         } catch (error) {
//             next(error);
//         }
//     };

//     updateProductQuantity = async (req, res, next) => {
//         try {
//             const { cid, pid } = req.params;
//             const { quantity } = req.body;
//             const updatedCart = await cartService.updateProductQuantity(
//                 cid,
//                 pid,
//                 quantity
//             );
//             res.json(updatedCart);
//         } catch (error) {
//             next(error);
//         }
//     };

//     updateCartProducts = async (req, res, next) => {
//         try {
//             const { cid } = req.params;
//             const { products } = req.body;
//             const updatedCart = await cartService.updateCartProducts(
//                 cid,
//                 products
//             );
//             res.json(updatedCart);
//         } catch (error) {
//             next(error);
//         }
//     };

//     removeProductFromCart = async (req, res, next) => {
//         try {
//             const { cid, pid } = req.params;
//             const updatedCart = await cartService.removeProductFromCart(
//                 cid,
//                 pid
//             );
//             res.json(updatedCart);
//         } catch (error) {
//             next(error);
//         }
//     };

//     clearCart = async (req, res, next) => {
//         try {
//             const { cid } = req.params;
//             await cartService.clearCart(cid);
//             res.status(204).end();
//         } catch (error) {
//             next(error);
//         }
//     };
// }


import BaseRouter from './BaseRouter.js';
import cartsController from '../controllers/carts.controller.js';
import { authRoles } from '../middlewares/authroles.js';

class CartsRouter extends BaseRouter {
    init() {
        this.get('/carts', ['AUTHORIZED'], cartsController.getAllCarts);
        this.get('/carts/:cid', ['AUTHORIZED'], cartsController.getCartById);
        this.post('/carts', ['AUTHORIZED'], cartsController.createCart);
        this.post('/carts/:cid/products/:pid', ['AUTHORIZED'], authRoles(['USER']), cartsController.addProductToCart);
        this.put('/carts/:cid/products/:pid', ['AUTHORIZED'], authRoles(['USER']), cartsController.updateProductQuantity);
        this.put('/carts/:cid', ['AUTHORIZED'], authRoles(['USER']), cartsController.updateCartProducts);
        this.delete('/carts/:cid/products/:pid', ['AUTHORIZED'], authRoles(['USER']), cartsController.removeProductFromCart);
        this.delete('/carts/:cid', ['AUTHORIZED'], authRoles(['USER']), cartsController.clearCart);
        this.post('/carts/:cid/purchase', ['AUTHORIZED'], authRoles(['USER']), cartsController.purchaseCart);
    }
}

const cartsRouter = new CartsRouter();
export default cartsRouter.getRouter();
