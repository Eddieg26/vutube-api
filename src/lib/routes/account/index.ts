import { Router } from '../router';
import createAccount from './createAccount';
import deleteAccount from './deleteAccount';
import getAccount from './getAccount';
import getAccounts from './getAccounts';
import updateAccount from './updateAccount';

export const accountRouter = new Router('/accounts');

accountRouter.get(getAccount.url, getAccount);
accountRouter.get(getAccounts.url, getAccounts);
accountRouter.post(createAccount.url, createAccount);
accountRouter.put(updateAccount.url, updateAccount);
accountRouter.delete(deleteAccount.url, deleteAccount);
