// import BaseRouter from '../routes/BaseRouter.js';
// import { productsService } from '../db/index.js';

// export default class ProductsRouter extends BaseRouter {
//     initializeRoutes() {
//         this.get('/products', ['PUBLIC'], this.getProducts);
//         this.get('/products/:pid', ['PUBLIC'], this.getProductById);
//         this.post('/products', ['AUTHORIZED'], this.createProduct);
//         this.put('/products/:pid', ['AUTHORIZED'], this.updateProduct);
//         this.delete('/products/:pid', ['AUTHORIZED'], this.deleteProduct);
//     }

//     getProducts = async (req, res, next) => {
//         try {
//             const { limit = 10, page = 1, query = '', sort = '' } = req.query;
//             const products = await productsService.getProducts({
//                 limit,
//                 page,
//                 query,
//                 sort,
//             });
//             res.json(products);
//         } catch (error) {
//             next(error);
//         }
//     };

//     getProductById = async (req, res, next) => {
//         try {
//             const { pid } = req.params;
//             const product = await productsService.getProductById(pid);
//             res.json(product);
//         } catch (error) {
//             next(error);
//         }
//     };

//     createProduct = async (req, res, next) => {
//         try {
//             const product = await productsService.createProduct(req.body);
//             res.status(201).json(product);
//         } catch (error) {
//             next(error);
//         }
//     };

//     updateProduct = async (req, res, next) => {
//         try {
//             const { pid } = req.params;
//             const updatedProduct = await productsService.updateProduct(
//                 pid,
//                 req.body
//             );
//             res.json(updatedProduct);
//         } catch (error) {
//             next(error);
//         }
//     };

//     deleteProduct = async (req, res, next) => {
//         try {
//             const { pid } = req.params;
//             await productsService.deleteProduct(pid);
//             res.status(204).end();
//         } catch (error) {
//             next(error);
//         }
//     };
// }

import productsController from '../controllers/products.controller.js';
import BaseRouter from './BaseRouter.js';
import { authRoles } from '../middlewares/authroles.js';

class ProductRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], productsController.getProducts);
        this.get('/:id', ['PUBLIC'], productsController.getProductById);
        this.post('/', ['ADMIN'], authRoles(['ADMIN']), productsController.createProduct);
        this.put('/:id', ['ADMIN'], authRoles(['ADMIN']), productsController.updateProduct);
        this.delete('/:id', ['ADMIN'], authRoles(['ADMIN']), productsController.deleteProduct);
    }
}

const productsRouter = new ProductRouter();
export default productsRouter.getRouter();
