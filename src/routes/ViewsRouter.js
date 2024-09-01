import BaseRouter from './BaseRouter.js';
import productModel from '../db/mongo/models/product.model.js';
import cartModel from '../db/mongo/models/cart.model.js';

class ViewsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], (req, res) => {
            res.render('Home');
        });

        this.get('/register', ['PUBLIC'], (req, res) => {
            res.render('Register');
        });

        this.get('/login', ['PUBLIC'], (req, res) => {
            res.render('Login');
        });

        this.get('/profile', ['USER'], (req, res) => {
            console.log(req.user);
            if (!req.user) {
                return res.redirect('/login');
            }
            res.render('Profile', { user: req.user });
        });

        this.get('/current', ['USER'], (req, res) => {
            if (!req.user) {
                return res.sendUnauthorized();
            }
            res.sendSuccess('User data retrieved successfully', req.user);
        });

        this.get('/logout', ['USER'], async (req, res) => {
            res.clearCookie(config.auth.jwt.COOKIE);
            res.redirect('/');
        });

        this.get('/products', ['PUBLIC'], async (req, res) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = 10;
                const skip = (page - 1) * limit;

                const paginationData = await productModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .lean();

                const products = paginationData;
                const totalCount = await productModel.countDocuments();
                const totalPages = Math.ceil(totalCount / limit);
                const hasNextPage = page < totalPages;
                const hasPrevPage = page > 1;
                const nextPage = hasNextPage ? page + 1 : null;
                const prevPage = hasPrevPage ? page - 1 : null;

                res.render('Products', {
                    products,
                    currentPage: page,
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage,
                });
            } catch (error) {
                console.error('Error fetching products:', error.message);
                res.status(500).send('Error fetching products');
            }
        });

        this.get('/products/:pid', ['PUBLIC'], async (req, res) => {
            const { pid } = req.params;

            try {
                const product = await productModel.findById(pid).lean();

                if (!product) {
                    return res.render('404');
                }

                res.render('ProductDetails', {
                    product,
                    mainImage: product.thumbnails.find(
                        (thumbnail) => thumbnail.main
                    ),
                });
            } catch (error) {
                console.error('Error fetching product details:', error.message);
                res.render('404');
            }
        });

        this.get('/realtimeproducts', ['PUBLIC'], async (req, res) => {
            try {
                const products = await productModel.find().lean();
                res.render('RealTimeProducts', {
                    title: 'Productos en Tiempo Real',
                    products,
                });
            } catch (error) {
                console.error('Error al obtener los productos:', error.message);
                res.status(500).send('Error interno del servidor');
            }
        });

        this.get('/carts/:cid', ['USER'], async (req, res) => {
            const { cid } = req.params;

            try {
                const cart = await cartModel
                    .findById(cid)
                    .populate('products.product')
                    .lean();

                if (!cart) {
                    return res.render('404');
                }

                res.render('Cart', { cart });
            } catch (error) {
                console.error('Error fetching cart details:', error.message);
                res.render('404');
            }
        });
    }
}

const viewsRouter = new ViewsRouter();
export default viewsRouter.getRouter();
