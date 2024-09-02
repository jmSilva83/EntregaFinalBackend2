import UserDAO from '../db/dao/UserDao.js';
import ProductDAO from '../db/dao/productDAO.js';
import TicketDAO from '../db/dao/TicketDAO.js';

export const usersService = UserDAO;
export const productsService = ProductDAO;
export const TicketsService = TicketDAO;
