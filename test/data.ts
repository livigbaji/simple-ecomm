import { UserService } from '../src/modules/users/services/user.service';
import { random, range } from 'lodash';
import { User } from '../src/modules/users/entities/user.entity';
import { ProductService } from '../src/modules/products/services/product.service';

export const createUsers = (amount: number, userService: UserService) => {
  return Promise.all(
    range(1, amount).map((index) => {
      return userService.createUser({
        email: `minted.user${index}@test.com`,
        name: `Minted user ${index}`,
        password: '123456',
      });
    }),
  );
};

export const createProducts = (
  amount: number,
  user: User,
  productService: ProductService,
) => {
  return Promise.all(
    range(1, amount).map((index) => {
      return productService.createProduct(
        {
          price: index * (random(true) + 1),
          name: `Minted product ${index}`,
          description: `Lorem ipsum dolor sit amet for product ${index} for user ${user.id}`,
          quantity: index * random(false),
        },
        user,
      );
    }),
  );
};
