import UserDao from '../db/dao/UserDao.js';
import UserRepository from '../repositories/UserRepository.js';

export const usersService = new UserRepository(new UserDao());
