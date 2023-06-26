import { Carts, Sessions, Users, Products, Ticket } from '../daos/factory.js'

import CartsRepository from './Carts.repository.js'
import ProductRepository from './Products.repository.js'
import ticketRepository from './ticket.repository.js'
import SessionsRepository from './Sessions.repository.js'
import UsersRepository from './Sessions.repository.js'

export const CartsService = new CartsRepository(Carts)
export const ProductService = new ProductRepository(Products)
export const UserService = new UsersRepository(Users)
export const SessionsService = new SessionsRepository(Sessions)
export const TicketService = new ticketRepository(Ticket)
