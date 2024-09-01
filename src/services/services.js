import UserDAO from '../db/dao/UserDao.js';
import productDAO from '../db/dao/productDAO.js';
import cartDAO from '../db/dao/CartDAO.js';

export const usersService = UserDAO;
export const productsService = productDAO;
export const cartsService = cartDAO;
