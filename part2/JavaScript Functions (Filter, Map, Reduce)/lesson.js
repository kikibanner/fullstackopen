/* 
----------------------# 
Higher Order Function #
----------------------#
*/

// Traditional Function
function triple(num) {
    num * 3
}

// Function as a value
var triple = function (num) {
    return num * 3
}


/* 
--------# 
 Filter #
--------#
*/

var animals = [
    { name: 'Sniffles', species: 'cat' },
    { name: 'Fido', species: 'dog' },
    { name: 'Rover', species: 'dog' },
    { name: 'Bunny', species: 'rabbit' },
    { name: 'Cuddles', species: 'rabbit' },
    { name: 'Puffykins', species: 'cat' },
    { name: 'Fernando', species: 'hedgehog' },
    { name: 'Knuckles', species: 'echidna' }
]

// Traditional For Loop
var dogs = []
for (var i = 0; i < animals.length; i++) {
    if (animals[i].species === 'dog') {
        dogs.push(animals[i])
    }
}

// Filter Function
var dogs = animals.filter(function (animal) {
    return animal.species === 'dog'
})

// Filter Function with Separated Callback Function
var isDog = function (animal) {
    return animal.species === 'dog'
}

var dogs = animals.filter(isDog)


/* 
-----# 
 Map #
-----#
*/

// Traditional For Loop
var names = []
for (var i = 0; i < animals.length; i++) {
    names.push(animals[i].name)
}

// Map
var names = animals.map(function (animal) {
    return `${animal.name} is a ${animal.species}`
})

// Map, with arrow function (the x is podo ae karo animal, cuma argument)
var names = animals.map((x) => `${x.name} is a ${x.species}`)


/* 
--------# 
 Reduce #
--------#
*/

var orders = [
    { amount: 250 },
    { amount: 400 },
    { amount: 100 },
    { amount: 325 }
]

// Traditional For Loop
var totalAmount = 0
for (var i = 0; i < orders.length; i++) {
    totalAmount += orders[i].amount
}

// Reduce
var totalAmount = orders.reduce(function (sum, order) {
    console.log(sum, order)
    return sum += order.amount
}, 0)

// Reduce with arrow function
var totalAmount = orders.reduce((sum, order) => sum += order.amount, 0)

/* 
EXPLANATION:
what is reduce in the code above?
reduce adalah method yang digunakan untuk mengubah array menjadi satu nilai
dalam hal ini, kita mengubah array menjadi total amount

reduce butuh 2 argument, yaitu callback function dan starting point
di dalam callback function, terdapat 2 argumen juga:
    argumen pertama adalah sesuatu yang akan berubah seiring iterasi,
    argumen kedua adalah elemen dari setiap iterasi, dalam contoh di atas adalah object {}
*/

