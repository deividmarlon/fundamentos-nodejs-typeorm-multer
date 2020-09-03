import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
      const transactions = await this.find();
      
      let income = 0, outcome = 0, balance = 0;
    
      transactions.map(transaction=>{
        if(transaction.type==='outcome'){
            outcome+=+(transaction.value);
        }else{
            income+=+(transaction.value);
        }
      })
  
      balance = income - outcome;
  
      return ({income,outcome,total:balance});
  }
}

export default TransactionsRepository;
