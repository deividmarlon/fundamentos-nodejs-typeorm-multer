import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface TransactionObj{
    title: string;
    type: string;
    value: number;
    category: string;
}

export default async function loadCSV(filePath: string): Promise<TransactionObj[]> {

  const readCSVStream = fs.createReadStream(filePath);

	const parseStream = csvParse({ 
	  from_line: 2,
	  ltrim: true,
	  rtrim: true,
	});
	
	const parseCSV = readCSVStream.pipe(parseStream);

	const transactions: TransactionObj[] = [];

    parseCSV.on('data', line => {       
        transactions.push({
            title: line[0],
            type: line[1],
            value: +(line[2]),
            category: line[3],
        });
    });
	
	await new Promise(resolve => {
		parseCSV.on('end', resolve);
  });
	
	return transactions;
}