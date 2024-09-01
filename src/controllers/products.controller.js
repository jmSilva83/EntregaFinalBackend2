import mongoose from 'mongoose';
import ProductManager from '../db/mongo/ProductManager.js';

const productManager = new ProductManager();

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;

        const queryObject = {};
        if (query) {
            queryObject.title = { $regex: query, $options: 'i' };
        }

        const sortObject = {};
        if (sort) {
            const [field, order] = sort.split(':');
            sortObject[field] = order === 'desc' ? -1 : 1;
        }

        const options = {
            limit: Number(limit),
            skip: (Number(page) - 1) * Number(limit),
            sort: sortObject,
        };

        const products = await productManager.getProducts(queryObject, options);
        const totalProducts = await productManager.countDocuments(queryObject);

        const prevLink = products.hasPrevPage
            ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}`
            : null;
        const nextLink = products.hasNextPage
            ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}`
            : null;

        res.json({
            products: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            prevLink,
            nextLink,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error('Invalid product ID');
        const product = await productManager.getProductById(id);
        if (!product) throw new Error('Product not found');
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { code, stock } = req.body;
        const exists = await productManager.findProductByCode(code);
        if (exists) {
            const updatedProduct =
                await productManager.updateProductStockByCode(code, stock);
            if (!updatedProduct)
                throw new Error('Error updating product stock');
            res.json(updatedProduct);
        } else {
            const product = await productManager.createProduct(req.body);
            res.status(201).json(product);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error('Invalid product ID');
        const product = await productManager.updateProduct(id, req.body);
        if (!product) throw new Error('Product not found');
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error('Invalid product ID');
        const product = await productManager.deleteProduct(id);
        if (!product) throw new Error('Product not found');
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
