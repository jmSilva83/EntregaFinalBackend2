import BaseRouter from './BaseRouter.js';
import cartsController from '../controllers/carts.controller.js';
import { authRoles } from '../middlewares/authroles.js';

class CartsRouter extends BaseRouter {
    init() {
        // Usando ['PUBLIC'] en lugar de ['AUTHORIZED']
        this.get('/', ['PUBLIC'], cartsController.getAllCarts); // Equivale a '/api/carts'
        this.get('/:cid', ['PUBLIC'], cartsController.getCartById); // Equivale a '/api/carts/:cid'
        this.post('/', ['PUBLIC'], cartsController.createCart); // Equivale a '/api/carts'
        this.post('/:cid/products/:pid', ['PUBLIC'], authRoles(['USER']), cartsController.addProductToCart); // Equivale a '/api/carts/:cid/products/:pid'
        this.put('/:cid/products/:pid', ['PUBLIC'], authRoles(['USER']), cartsController.updateProductQuantity); // Equivale a '/api/carts/:cid/products/:pid'
        this.put('/:cid', ['PUBLIC'], authRoles(['USER']), cartsController.updateCartProducts); // Equivale a '/api/carts/:cid'
        this.delete('/:cid/products/:pid', ['PUBLIC'], authRoles(['USER']), cartsController.removeProductFromCart); // Equivale a '/api/carts/:cid/products/:pid'
        this.delete('/:cid', ['PUBLIC'], authRoles(['USER']), cartsController.clearCart); // Equivale a '/api/carts/:cid'
        this.post('/:cid/purchase', ['PUBLIC'], authRoles(['USER']), cartsController.purchaseCart); // Equivale a '/api/carts/:cid/purchase'
    }
}

const cartsRouter = new CartsRouter();
export default cartsRouter.getRouter();
