import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductsRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductsRepository);

    //verifica se o produto existe
    const product = await productsRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found');
    }

    //testa se já existe um produto com o nome informado, se tiver não deixa atualizar pra esse nome
    const productsExists = await productsRepository.findByName(name);
    if (productsExists && productsExists.name !== product.name) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
