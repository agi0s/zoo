class Pet {
    constructor(color, price, type, id) {
        this.id = id || counter();
        this.color = color;
        this.price = price;
        this.type = type;
    }
}

class Dog extends Pet {
    constructor(color, price, name, id) {
        super(color, price, id);
        this.name = name;
    }
}

class Cat extends Pet {
    constructor(color, price, name, id, isFluffy) {
        super(color, price, id);
        this.name = name;
        this.isFluffy = isFluffy;
    }
}

class Hamster {
    constructor(isFluffy, id) {
        this.id = id || counter();
        this.isFluffy = isFluffy;
    }
}

class PetShop {
    constructor(collection) {
        this.render = new PetShopView();
        this.collection = [];
        this.cats = [];
        this.fluffyOrWhite = [];
        this.priceGreaterThanAvgList = [];

        this.handleData(collection);
    }

    handleData(collection) {
        collection.forEach(animal => {
            this.makeCollection(animal);
        });

        this.findGreaterThanAvg(collection);

        this.render.AllCats(this.cats);
        this.render.PriceGreaterThanAvg(this.priceGreaterThanAvgList);
        this.render.FluffyOrWhite(this.fluffyOrWhite);
    }

    makeCollection(element) {
        let animal = element;

        if (animal.type === 'cat') {
            animal = new Cat(element.color, element.price, element.name, element.id, element.isFluffy);
            this.cats.push(animal);
        }

        if (animal.type === 'dog') {
            animal = new Dog(animal.color, animal.price, animal.name, element.id);
        }

        if (animal.type === 'hamster') {
            animal = new Hamster(animal.id, animal.isFluffy);
        }

        if (animal.isFluffy || animal.color === 'white') {
            this.fluffyOrWhite.push(animal);
        }

        this.collection.push(animal);
    }

    findGreaterThanAvg(collection) {
        let average = 0;

        collection.forEach(element => {
            if(element.price){
                average += +element.price;
            }
        });

        average = average / collection.length;

        function isBigger(element) {
            return element.price > average;
        }

        this.priceGreaterThanAvgList = collection.filter(isBigger);
    }
}

class PetShopView {
    constructor() {
        this.petShopTemplate = document.createElement('div');
        document.body.appendChild(this.petShopTemplate);
        this.allCatsList = this.createList();
        this.priceGreaterThanAvgList = this.createList();
        this.fluffyOrWhiteList = this.createList();

        this.injectDiv();
    }

    injectDiv() {
        this.allCatsList.setAttribute('class', 'allCatsList');
        this.priceGreaterThanAvgList.setAttribute('class', 'priceGreaterThanAvgList');
        this.fluffyOrWhiteList.setAttribute('class', 'fluffyOrWhiteList');
        this.petShopTemplate.appendChild(this.allCatsList);
        this.petShopTemplate.appendChild(this.priceGreaterThanAvgList);
        this.petShopTemplate.appendChild(this.fluffyOrWhiteList);
    }

    AllCats(cats) {
        this.buildList(cats, 'cat', 'cat');
    }

    PriceGreaterThanAvg(animal) {
        this.buildList(animal, 'animal', 'price');
    }

    FluffyOrWhite(list) {
        this.buildList(list, 'cat', 'fluffy');
    }

    createList() {
        return document.createElement('ul');
    }

    getTemplate(object, type) {
        let template = document.createElement('p');
        if (type === 'cat') {
            template.innerHTML = `<span class='id'>ID: ${object.id}</span>
            Name: ${object.name}`;
            return template;
        }

        if (type === 'animal') {
            template.innerHTML = `<span>ID: ${object.id}</span>
            <span class="price">Price: ${object.price}</span>
            Name: ${object.name}`;
            return template;
        }

        if (type === 'fluffyOrWhite') {
            if (object.isFluffy && object.color) {
                template.innerHTML = `<span class='id'>ID: ${object.id}</span>
                                  <span class="fluffy">Is Fluffy ${object.isFluffy}</span>
                                  <span class="color"Color: ${object.color}</span>
                                  Name: ${object.name}`;
          		  return template;
            }

            if (object.isFluffy) {
                template.innerHTML = `<span class='id'>ID: ${object.id}</span>
                                  <span class="fluffy">Is Fluffy: ${object.isFluffy}</span>`;
            
          			return template;
        		}
        }
    }

    buildList(collection, type, list) {
        collection.forEach(element => {
            let p = this.getTemplate(element, type);
            if(list === 'cat'){this.allCatsList.appendChild(p);}
            if(list === 'price'){this.priceGreaterThanAvgList.appendChild(p);}
            if(list === 'fluffy'){this.fluffyOrWhiteList.appendChild(p);}
        });
    }
}

var counter = (function() {
    let counter = 0;
    return function() {
        return counter++;
    };
}());

let array = [
    { type: 'cat', color: 'black', name: 'Pufik', price: '100', isFluffy: false },
    { type: 'cat', color: 'red', name: 'Rizhik', price: '250', isFluffy: false },
    { type: 'cat', color: 'white', name: 'Filya', price: '999', isFluffy: false },
    { type: 'dog', color: 'yellow', name: 'Rex', price: '500' },
    { type: 'dog', color: 'white', name: 'Husky', price: '500' },
    { type: 'hamster', isFluffy: true },
    { type: 'hamster', isFluffy: true },
    { type: 'cat', color: 'gray', name: 'Shadow', price: '499', isFluffy: true }
];

let ps = new PetShop(array);

let cats = document.querySelector('.allCatsList');
let h2 = document.createElement('h2');
h2.innerText = 'Cats';
cats.prepend(h2);

let fluffyOrWhiteList = document.querySelector('.fluffyOrWhiteList');
let h2fluffy = document.createElement('h2');
h2fluffy.innerText = 'Fluffy or white List';
fluffyOrWhiteList.prepend(h2fluffy);

let price = document.querySelector('.priceGreaterThanAvgList');
let h2price = document.createElement('h2');
h2price.innerText = 'Price Greater Than Average List';
price.prepend(h2price);