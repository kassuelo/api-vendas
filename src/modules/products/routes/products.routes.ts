import { Router } from 'express';
import ProductsController from '../controller/ProductsController';
import { celebrate, Joi, Segments } from 'celebrate';

const productsRouter = Router(); //acesso ao get, post, put e delete
const productsController = new ProductsController();

productsRouter.get('/', productsController.index);
productsRouter.get(
  '/:id', //parametro
  celebrate({
    //middleware
    [Segments.PARAMS]: {
      //o paremetro tem que ser string, tem que ser uuid e é obrigado a vir um valor
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.show, //metodo chamado pela rota
);
productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().integer().required(),
    },
  }),
  productsController.create,
);
productsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().integer().required(),
    },
  }),
  productsController.update,
);
productsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  productsController.delete,
);

export default productsRouter;
