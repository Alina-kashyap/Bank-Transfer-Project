'use strict';

// Data

const account1 = {
  owner: 'Vikram Kashyap',
  transfers: [-900, 456, 300, -876, 900, 850, 1700, -1000],
  rateOfInterest: 1.5, // in %
  pin: 6754,
};

const account2 = {
  owner: 'Henry Rouktan',
  transfers: [1000, 987, 800, -700, 400, -1000, -1700, 900],
  rateOfInterest: 1.2, // in %
  pin: 2456,
};

const account3 = {
  owner: 'Joas socth',
  transfers: [-900, 400, 500, -854, 1000, -654, 1600, -987],
  rateOfInterest: 2, // in %
  pin: 1111,
};

const account4 = {
  owner: 'Vikey Lias',
  transfers: [3000, 600, -1000, -576, 400, -650, -1700, 8000],
  rateOfInterest: 2.3, // in %
  pin: 1010,
};

const account5 = {
  owner: 'Lisa Sonth',
  transfers: [-800, 8765, 200, 800, -900, -1250, 1900, 4000],
  rateOfInterest: 1.6, // in %
  pin: 9999,
};

const accounts = [account1, account2, account3, account4, account5];

const welcomeLabel = document.querySelector('.welcome');
const dateLabel = document.querySelector('.date');
const balanceLable = document.querySelector('.balance__value');
const sumInLabel = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransaction = document.querySelector('.transaction');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayTransactions = function (transfers, sort = false) {
  // Not showing the inner HTMl data
  containerTransaction.innerHTML = '';

  // Sort the values

  const trans = sort ? transfers.slice().sort((a, b) => a - b) : transfers;

  trans.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawl';

    const html = `  
      <div class="transaction__row">
        <div class="transaction__type
        transaction__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="transaction__value">${mov}💲</div>
        </div>`;

    containerTransaction.insertAdjacentHTML('afterbegin', html);
  });
};
// displayTransactions(account1.transfers);

const calcDisplayPrintBalance = function (acc) {
  acc.balance = acc.transfers.reduce((acc, mov) => acc + mov, 0);

  balanceLable.textContent = `${acc.balance} EUR`;
};

// calcDisplayPrintBalance(account1.transfers);

const calcDisplaySummary = function (acc) {
  const incomes = acc.transfers
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  sumInLabel.textContent = `${incomes}💲`;

  const out = acc.transfers
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}💲`;

  const interest = acc.transfers
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.rateOfInterest) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${Math.trunc(interest)}💲`;
};
// calcDisplaySummary(account1.transfers);

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });

  // const userName = user
  //   .toLowerCase()
  //   .split(' ')
  //   .map(name => name[0])
  //   .join('');
  // return userName;
};

createUserNames(accounts);

// Update Ui function

function updateUI(acc) {
  // Display movements
  displayTransactions(acc.transfers);

  // Display balance
  calcDisplayPrintBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
}

// Envent handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //E statds for Event
  // Prevent Default function prevents form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log('LOGIN');
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message

    welcomeLabel.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
    console.log('LOGIN');
  }
});

// Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAccount);

  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // console.log('Transfered successfully');
    currentAccount.transfers.push(-amount);
    receiverAccount.transfers.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

// Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.transfers.some(mov => mov >= amount * 0.1)) {
    // Add transfers

    currentAccount.transfers.push(amount);

    // Update UI

    updateUI(currentAccount);

    // Empty the value

    inputLoanAmount.value = '';
  }
});

// CLose Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const closePin = Number(inputClosePin.value);
  if (
    inputCloseUsername.value === currentAccount.username &&
    closePin === currentAccount.pin
  ) {
    console.log('Its closed');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // Delete account

    accounts.splice(index, 1);

    // Hide UI after deleting account

    containerApp.style.opacity = 100;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  // console.log('Its closed');
});

// Sorting the button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTransactions(currentAccount.transfers, !sorted);
  sorted = !sorted;
});
// console.log(accounts);

// console.log(containerTransaction.innerHTML);

// const user = 'Henry Rouktan'; // Ak

// console.log(createUserNames(user));

const account = accounts.find(acc => acc.owner === 'Henry Rouktan');
// const account = accounts.filter(acc => acc.owner === 'Henry Rouktan');

// console.log(account);

// ********************************
// Same as written below

// const accountTransfers = accounts.map(acc => acc.transfers);
// console.log(accountTransfers);

// const allTransfers = accountTransfers.flat();
// console.log(allTransfers);

// const overAllBalance = allTransfers.reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

// const overAllBalance = accounts
//   .map(acc => acc.transfers)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overAllBalance);

// FlatMap

const overAllBalance = accounts
  .flatMap(acc => acc.transfers)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overAllBalance);
// ********************************

balanceLable.addEventListener('click', function () {
  const transactionUI = Array.from(
    document.querySelectorAll('.transaction__value'),
    ele => Number(ele.textContent.replace('💲', ''))
  );
  console.log(transactionUI);
});

//   ************** Revision *****************//

// Using flatMap flat filter reduce
// const bankDepositSum = accounts.map(acc => acc.transfers).flat();

const bankDepositSum = accounts
  .flatMap(acc => acc.transfers)
  .filter(mov => mov > 0)
  .reduce((sum, curr) => sum + curr, 0);

console.log(bankDepositSum);

//2.

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.transfers)
//   .filter(mov => mov >= 1000).length;

const numDeposits1000 = accounts
  .flatMap(acc => acc.transfers)
  .reduce((count, curr) => (curr >= 1000 ? count + 1 : count), 0);

console.log(numDeposits1000);

// 3.

// const sums = accounts
const { deposit, withdrawl } = accounts
  .flatMap(acc => acc.transfers)
  .reduce(
    (sums, curr) => {
      // curr > 0 ? (sums.deposit += curr) : (sums.withdrawl += curr);
      sums[curr > 0 ? 'deposit' : 'withdrawl'] += curr;

      return sums;
    },
    { deposit: 0, withdrawl: 0 }
  );

console.log(deposit, withdrawl);
