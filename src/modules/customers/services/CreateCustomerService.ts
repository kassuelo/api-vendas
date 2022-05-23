import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '@modules/customers/typeorm/entities/Customer';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

class CreateCustomerService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customerExists = await customersRepository.findByEmail(email);
    if (customerExists) {
      throw new AppError('There is already one Customer with this e-mail');
    }

    const Customer = customersRepository.create({
      name,
      email,
    });

    await customersRepository.save(Customer);
    return Customer;
  }
}

export default CreateCustomerService;
