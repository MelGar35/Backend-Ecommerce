import { Carts, Users, Products, Ticket } from '../daos/factory.js'

import CartsRepository from './Carts.repository.js'
import ProductRepository from './Products.repository.js'
import ticketRepository from './ticket.repository.js'
import UsersRepository from './Users.repository.js'


export const CartsService = new CartsRepository(Carts)
export const ProductService = new ProductRepository(Products)
export const UserService = new UsersRepository(Users)
export const TicketService = new ticketRepository(Ticket)
