//Swagger 
export const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Shanti Commerce Api",
        description: "Un sitio de venta de productos espirituales",
      },
    },
    apis: [`src/docs/**/*.yaml`],
  };