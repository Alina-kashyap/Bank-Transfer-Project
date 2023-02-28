'use strict';

// Data

const account1 = {
  owner: 'Jonas Klith',
  transfers: [-900, 456.9, 300, -876, 900, 850, 1700, -1000],
  rateOfInterest: 1.5, // in %
  pin: 2222,

  movementsDates: [
    '2023-02-05T21:31:17.178Z',
    '2022-02-03T09:15:04.904Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-01T10:17:24.185Z',
    '2022-09-08T14:11:59.604Z',
    '2022-06-27T17:01:17.194Z',
    '2023-01-28T23:36:17.929Z',
    '2023-01-31T10:51:36.790Z',
  ],
  // currency: 'EUR',
  // locale: 'pt-PT', // de-DE

  currency: 'IND',
  locale: 'hi-IN',
};

const account2 = {
  owner: 'Mahi Fedures',
  transfers: [1000, 987, 800, -700, 400, -1000, -1700, 900],
  rateOfInterest: 1.2, // in %
  pin: 1111,

  movementsDates: [
    '2023-02-05T21:31:17.178Z',
    '2022-02-03T09:15:04.904Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-01T10:17:24.185Z',
    '2022-09-08T14:11:59.604Z',
    '2022-06-27T17:01:17.194Z',
    '2023-01-28T23:36:17.929Z',
    '2023-01-31T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

const formatTransactionDate = function (date, locale) {
  const calcPassedDate = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const passedDate = calcPassedDate(new Date(), date);
  // console.log(passedDate);

  if (passedDate === 0) return 'Today';
  if (passedDate === 1) return 'Yesterday';
  if (passedDate <= 7) return `${passedDate} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  return new Intl.DateTimeFormat(locale).format(date);
};

// Formatted currency

const formatCurr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayTransactions = function (acc, sort = false) {
  // Not showing the inner HTMl data
  containerTransaction.innerHTML = '';

  // Sort the values

  const trans = sort
    ? acc.transfers.slice().sort((a, b) => a - b)
    : acc.transfers;

  trans.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawl';

    // Overlooping date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatTransactionDate(date, acc.locale);
    // console.log(displayDate);

    // API number calling

    const formatTransfer = formatCurr(mov, acc.locale, acc.currency);

    const html = `  
      <div class="transaction__row">
        <div class="transaction__type
        transaction__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="transaction__date">${displayDate}</div>
          <div class="transaction__value">${formatTransfer}</div>
        </div>`;

    containerTransaction.insertAdjacentHTML('afterbegin', html);
  });
};
// displayTransactions(account1.transfers);

const calcDisplayPrintBalance = function (acc) {
  acc.balance = acc.transfers.reduce((acc, mov) => acc + mov, 0);

  balanceLable.textContent = formatCurr(acc.balance, acc.locale, acc.currency);

  // balanceLable.textContent = `${acc.balance.toFixed(2)} EUR`;
};

// calcDisplayPrintBalance(account1.transfers);

const calcDisplaySummary = function (acc) {
  const incomes = acc.transfers
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  sumInLabel.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.transfers
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.transfers
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.rateOfInterest) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
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
  displayTransactions(acc);

  // Display balance
  calcDisplayPrintBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
}

// Set timer in Login

const startLogOutTimer = function () {
  const instantTimer = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user

    if (time === 0) {
      clearInterval(timer);
      welcomeLabel.textContent = 'Log in to get started';

      containerApp.style.opacity = 0;
    }

    // Decrease 1 second
    time--;
  };
  // set timer to 5 minute
  let time = 120;

  // Call the timer every second
  instantTimer();
  const timer = setInterval(instantTimer, 1000);

  return timer;
};

// FAKE ALWAYS LOGGED IN

// let currentAccount;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// /Experienting API

// const now = new Date();

// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// const locale = navigator.language;
// console.log(locale);

// dateLabel.textContent = new Intl.DateTimeFormat(locale, options).format(now);

// Envent handler

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  //E statds for Event
  // Prevent Default function prevents form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log('LOGIN');
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message

    welcomeLabel.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Creating Date and TIme

    //Experienting API

    const now = new Date();

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'numeric',
    };
    const locale = navigator.language;
    console.log(locale);

    dateLabel.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // dateLabel.textContent = `${day}/${month}/${year},${hour}:${min}`;

    // FORMAT OF DATE  dd/mm/yy

    // Clear input fields

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    //if another user is logined already and another using trying to log in then there will be seperate timer for the different users

    if (timer) clearInterval(timer);
    // Updating the timer

    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
    console.log('LOGIN');
  }
});

// Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
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

    // Transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Resetting the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Add Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.transfers.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add transfers

      currentAccount.transfers.push(amount);

      // Transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI

      updateUI(currentAccount);

      // Resetting the timer
      clearInterval(timer);
      timer = startLogOutTimer();

      console.log('Request approved');
    }, 2500);

    // Empty the value
  }
  inputLoanAmount.value = '';
});

// CLose Account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const closePin = +inputClosePin.value;
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

balanceLable.addEventListener('click', function () {
  [...document.querySelectorAll('.transaction__row')].forEach(function (
    row,
    i
  ) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});
