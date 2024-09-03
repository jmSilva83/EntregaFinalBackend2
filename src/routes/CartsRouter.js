import BaseRouter from './BaseRouter.js';
import cartsController from '../controllers/carts.controller.js';
import { authRoles } from '../middlewares/authroles.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

class CartsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], cartsController.getAllCarts);
        this.get('/:cid', ['PUBLIC'], cartsController.getCartById);
        this.post('/', ['PUBLIC'], cartsController.createCart);
        this.post(
            '/:cid/products/:pid',
            ['PUBLIC'],
            authRoles(['USER']),
            cartsController.addProductToCart
        );
        this.put(
            '/:cid/products/:pid',
            ['PUBLIC'],
            authRoles(['USER']),
            cartsController.updateProductQuantity
        );
        this.put(
            '/:cid',
            ['PUBLIC'],
            authRoles(['USER']),
            cartsController.updateCartProducts
        );
        this.delete(
            '/:cid/products/:pid',
            ['PUBLIC'],
            authRoles(['USER']),
            cartsController.removeProductFromCart
        );
        this.delete(
            '/:cid',
            ['PUBLIC'],
            authRoles(['USER']),
            cartsController.clearCart
        );
        this.post(
            '/:cid/purchase', 
            ['PUBLIC'], authMiddleware,
            authRoles(['USER']),
            cartsController.purchaseCart
        );
    }
}

const cartsRouter = new CartsRouter();
export default cartsRouter.getRouter();
