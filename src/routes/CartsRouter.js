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

        // Nuevas rutas con prefijo /api
        this.get('/api/carts', ['AUTHORIZED'], cartsController.getAllCarts);
        this.get('/api/carts/:cid', ['AUTHORIZED'], cartsController.getCartById);
        this.post('/api/carts', ['AUTHORIZED'], cartsController.createCart);
        this.post('/api/carts/:cid/products/:pid', ['AUTHORIZED'], authRoles(['USER']), cartsController.addProductToCart);
        this.put('/api/carts/:cid/products/:pid', ['AUTHORIZED'], authRoles(['USER']), cartsController.updateProductQuantity);
        this.put('/api/carts/:cid', ['AUTHORIZED'], authRoles(['USER']), cartsController.updateCartProducts);
        this.delete('/api/carts/:cid/products/:pid', ['AUTHORIZED'], authRoles(['USER']), cartsController.removeProductFromCart);
        this.delete('/api/carts/:cid', ['AUTHORIZED'], authRoles(['USER']), cartsController.clearCart);
        this.post('/api/carts/:cid/purchase', ['AUTHORIZED'], authRoles(['USER']), cartsController.purchaseCart);
    }
}

const cartsRouter = new CartsRouter();
export default cartsRouter.getRouter();
