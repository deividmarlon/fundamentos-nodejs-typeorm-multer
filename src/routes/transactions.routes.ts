import { Router } from 'express';
import { getRepository, createQueryBuilder, getCustomRepository } from 'typeorm';

import multer from 'multer';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find({
      relations: ["category"]
    });

    const transactionsBalanceRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsBalanceRepository.getBalance();
    
    return response.json({transactions,balance});
});

transactionsRouter.post('/', async (request, response) => {
    const {title, value, type, category} = request.body;

    const createTransaction = new CreateTransactionService();

    const newTransaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    })

    return response.json(newTransaction);


});

transactionsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params;

    const deleteTransaction = new DeleteTransactionService();

    await deleteTransaction.execute({id});

    return response.status(204).send();

});

transactionsRouter.post('/import',upload.single('file'), async (request, response) => {
  
  const csv_filename = request.file.filename;

  const importTransactions = new ImportTransactionsService();

  const importedTransactions = await importTransactions.execute({
    csv_filename,
  });
  
  return response.json(importedTransactions);

});

export default transactionsRouter;
