import config from '../config/config.js';
import mongoose from 'mongoose';


export let Users;
export let Products;
export let Carts;
export let Ticket;


switch (config.PERSISTENCE) {
  case 'MONGO':
    console.log('Persistence from DB')
    mongoose.set('strictQuery', true)
    const connect = mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => console.log("DB is connected"))
      .catch((err) => console.error(err))


    const { default: usersMongo } = await import('./mongo/users.mongo.js')
    const { default: productMongo } = await import('./mongo/products.mongo.js')
    const { default: cartMongo } = await import('./mongo/carts.mongo.js')
    const { default: ticketMongo } = await import('./mongo/ticket.mongo.js')

    Users = usersMongo;
    Products = productMongo;
    Carts = cartMongo;
    Ticket = ticketMongo;

    break;


  case 'MEMORY':


    const { default: usersMemory } = await import('./memory/users.memory.js')
    const { default: productMemory } = await import('./memory/products.memory.js')
    const { default: cartMemory } = await import('./memory/carts.memory.js')


    console.log("Persistence from memory")
    Users = usersMemory;
    Products = productMemory;
    Carts = cartMemory;

}
