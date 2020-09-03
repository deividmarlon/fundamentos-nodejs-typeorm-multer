import path from 'path';

import uploadConfig from '../config/upload';

import csvToTransactionsJsonArray from '../utils/csvToTransactionsJsonArray'

import CreateTransactionService from './CreateTransactionService'; 
import Transaction from '../models/Transaction';

interface RequestDTO{
    csv_filename:string;
}


class ImportTransactionsService {
  //async execute(): Promise<Transaction[]> {
  async execute({csv_filename}:RequestDTO): Promise<Transaction[]> {

    const localFilesDirectory = uploadConfig.directory;
    const csvLocalFilePath = path.join(localFilesDirectory,csv_filename);

    const transactionsFromCsv = await csvToTransactionsJsonArray(csvLocalFilePath);

    const importedTransactions:Transaction[] = []; 

    const createTransaction = new CreateTransactionService();

    for (const transaction of transactionsFromCsv) {
      const createdTransaciton = await createTransaction.execute(transaction);
      importedTransactions.push(createdTransaciton);
    }    
    
    return importedTransactions;

  }
}

export default ImportTransactionsService;
