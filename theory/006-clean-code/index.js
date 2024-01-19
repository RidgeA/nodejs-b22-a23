/**
 * https://www.oreilly.com/library/view/clean-code-a/9780136083238/
 * https://martinfowler.com/books/refactoring.html
 * https://12factor.net/
 * https://www.coursera.org/learn/algorithms-part1
 * https://www.yakaboo.ua/ua/grokaemo-algoritmi.html
 */

const arr = [];
const arr2 = [];

// O(1)
arr[1];

// O(log N)
binarySearch(arr);

// O(N)
arr.includes(1);

// O(N * log N),
arr.sort();

// O(N^2)
arr.forEach(item => arr2.includes(1));
for (let i = 0; i < arr.length; i++) { // O(N = arr.length)
  for (let j = 0; j < arr2.length; j++) { // O(N = arr2.length)
    if (arr[i] === arr2[j]) {
      //
    }
  }
}


function priceHigherThan(threshold) {
  return ({ price }) => price > threshold;
}

function applyDiscountPercent(percent) {
  return (item) => {
    return {
      ...item,
      price: item.price * percent / 100
    };
  };
}

function calculateTotalPrice() {
  return (sum, { price }) => {
    return sum + price;
  };
}

const goods = [{
  id: 1,
  name: "laptop",
  price: 1000
}];

const highPriceGoodsWithDiscountTotalPrice = goods
  .filter(priceHigherThan(1000))
  .map(applyDiscountPercent(10))
  .reduce(calculateTotalPrice(), 0);


const a = 1;
const b = 2;
const max = a > b ? a : b;

Promise.all([
  a ? db.insert({}) : {},
  a ? db.insert() : {},
  a ? db.insert() : {},
  a ? db.insert() : {},
  a ? db.insert() : {},
  a ? db.insert() : {},
])

const operations = [];

if (a) {
  operations.push(db.insert())
}

//...

Promise.all([operations])
