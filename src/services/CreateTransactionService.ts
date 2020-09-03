import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';



interface RequestDTO{
  title: string,
  value: number,
  type: string,
  category: string,
}

class CreateTransactionService {
  public async execute({title,value, type, category}:RequestDTO): Promise<Transaction> {
      const transactionsRepository = getCustomRepository(TransactionsRepository);
      
      const balance = await transactionsRepository.getBalance();

      if(type==='outcome' &&  value > balance.total){
        throw new AppError('Sorry! Insufficient balance!',400);
      }

      const categoriesRepository = getRepository(Category);

      const existsCategory = await categoriesRepository.findOne({
        where: {title:category},
      });
      
      if(existsCategory){
        category = existsCategory.id;
      }else{
        const newCategory = categoriesRepository.create({
          title: category,
        })

        await categoriesRepository.save(newCategory);

        category = newCategory.id;
  
      }
      const newTransaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: category,
      })

      await transactionsRepository.save(newTransaction);

      return newTransaction;
  }
}

export default CreateTransactionService;
