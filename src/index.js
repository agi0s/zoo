class Pet {
    constructor(color, price, id) {
        this.id = id || counter();
        this.color = color;
        this.price = price;
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

class Hamster extends Pet {
    constructor(color, price, id, isFluffy) {
        super(color, price, id);
        this.isFluffy = isFluffy;
        this.name = '🐹';
    }
}

class PetShopController {
    constructor() {
        this.model = new PetShop();
        this.view = new PetShopView('');
        this.dataURL = '../data.json';

        let promise = new Promise((resolve) => {
            this.model.fetchData(this.dataURL, resolve);
        });

        promise.then(() => {
            this.view.AllCats(this.model.cats);
            this.view.PriceGreaterThanAvg(this.model.priceGreaterThanAvgList);
            this.view.FluffyOrWhite(this.model.fluffyOrWhite);
            this.view.injectDiv();
            this.view.addHeadings();
            this.initListeners();
            this.cleanPetsArray();
        });
    }

    initListeners() {
        let selectors = document.querySelectorAll('.classSelector'),
            addNewPets = document.querySelector('.addNewPets'),
            clearButtons = document.querySelectorAll('.clear'),
            switchers = document.querySelectorAll('.switcher'),
            addPets = document.querySelectorAll('.addPet');

            selectors.forEach(element => element.addEventListener('change', event => {
                this.switchClass(event, event.currentTarget.parentNode.parentNode)
            }));
            clearButtons.forEach(element => element.addEventListener('click', this.clearInput.bind(this)));
            switchers.forEach(element => element.addEventListener('change', e => this.toggler(e)));
            addPets.forEach(element => element.addEventListener('click', this.view.addPetForm.bind(this)));
            addNewPets.addEventListener('click', this.renderNewPets.bind(this));
    }

    switchClass(event, container) {
        switch (event.target.value) {
            case 'dog':
                this.view.displayField('dog', container);
                break;
            case 'cat':
                this.view.displayField('cat', container);
                break;
            case 'hamster':
                this.view.displayField('hamster', container);
                break;
        }
    }

    renderNewPets(){
            this.model.handleData(this.parseData());
            this.view.AllCats(this.model.cats);
            this.view.PriceGreaterThanAvg(this.model.priceGreaterThanAvgList);
            this.view.FluffyOrWhite(this.model.fluffyOrWhite); 
            this.cleanPetsArray();
            this.clearInput();
    }

    parseData() {
        let pets = document.querySelectorAll('.petForm'),
            parsedObjects = [];
  
        pets.forEach( pet => {
            let className = pet.querySelector('.classSelector').value,
                template = this.getAnimalTemplate(className, pet);

            parsedObjects.push(template);
        });

        return parsedObjects;
    }

    cleanPetsArray(){
        this.model.cats = [];
        this.model.fluffyOrWhite = [];
        this.model.priceGreaterThanAvgList = [];
        this.model.collection = [];
    }

    clearInput() {
        let petName = document.querySelectorAll('.petName'),
            petColor = document.querySelectorAll('.petColor'),
            petPrice = document.querySelectorAll('.petPrice'),
            petFluffy = document.querySelectorAll('.petFluffy'),
            fields = [...petName, ...petColor, ...petPrice, ...petFluffy];

        fields.forEach(field => field.firstElementChild.value = "");
    }

    getAnimalTemplate(animalClass, pet) {
        let object = {},
            name = pet.querySelector('.petName').firstElementChild.value,
            color = pet.querySelector('.petColor').firstElementChild.value,
            price = pet.querySelector('.petPrice').firstElementChild.value,
            isFluffy = pet.querySelector('.inputIsFluffy').value;

        if (animalClass === 'dog') {
            object = {
                type: animalClass,
                name: name,
                color: color,
                price: price
            }
        } else if (animalClass === 'cat') {
            object = {
                type: animalClass,
                name: name,
                color: color,
                price: price,
                isFluffy: isFluffy
            }
        } else if (animalClass === 'hamster') {
            object = {
                type: animalClass,
                color: color,
                price: price,
                isFluffy: isFluffy
            }
        }

        return object;
    }

    toggler(event) {
        if (event.target.value === '') {
            event.target.value = 'true';
        } else {
            event.target.value = '';
        }
    }
}

class PetShop {
    constructor() {
        this.collection = [];
        this.cats = [];
        this.fluffyOrWhite = [];
        this.priceGreaterThanAvgList = [];
        this.price = {
            total: 0,
            average: 0,
            quantity: 0
        };
    }

    fetchData(URL, callback) {
        fetch(URL)
            .then(response => response.json())
            .then(animals => {
                this.handleData(animals);
            })
            .then(
                () => {
                    callback();
                }
            )
            .catch(error => console.error('Error:', error));
    }

    handleData(collection) {
        collection.forEach(animal => {
            this.makeCollection(animal);
        });

        this.findGreaterThanAvg(this.collection);
        return true;
    }

    makeCollection(element) {
        let animal = element;

        if (animal.type === 'cat') {
            animal = new Cat(animal.color, animal.price, animal.name, animal.id, animal.isFluffy);
            this.cats.push(animal);
        }

        if (animal.type === 'dog') {
            animal = new Dog(animal.color, animal.price, animal.name, animal.id);
        }

        if (animal.type === 'hamster') {
            animal = new Hamster(animal.color, animal.price, animal.id, animal.isFluffy);
        }

        if (animal.isFluffy === 'true' || animal.color === 'white') {
            this.fluffyOrWhite.push(animal);
        }

        this.collection.push(animal);
    }

    findGreaterThanAvg(collection) {
        collection.forEach(element => {
            if (element.price) {
                this.price['total'] += +element.price;
                this.price['quantity'] += 1;
            }
        });

        this.price['average'] = this.price['total'] / this.price['quantity'];
        
        this.priceGreaterThanAvgList = collection.filter((element) => {
            return +element.price > this.price['average'];
        });
    }
}

class PetShopView {
    constructor() {
        this.petShopTemplate = document.createElement('div');
        this.petShopTemplate.classList = 'PetShop';
        this.container = document.querySelector('.row.ps');
        this.container.appendChild(this.petShopTemplate);

        this.allCatsList = this.createList();
        this.priceGreaterThanAvgList = this.createList();
        this.fluffyOrWhiteList = this.createList();
    }

    injectDiv() {
        this.allCatsList.setAttribute('class', 'allCatsList col s4');
        this.priceGreaterThanAvgList.setAttribute('class', 'priceGreaterThanAvgList col s4');
        this.fluffyOrWhiteList.setAttribute('class', 'fluffyOrWhiteList col s4');
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
        this.buildList(list, 'fluffy', 'fluffy');
        list = [];
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
            template.innerHTML = `<span class='id'>ID: ${object.id}</span>
            <span class="price">Price: ${object.price}</span>
            Name: ${object.name}`;
            return template;
        }

        if (object.color === 'white') {
            template.innerHTML = `<span class='id'>ID: ${object.id}</span>
                                  ${(object.name) ? object.name : ""} is white!`;
            return template;
        }

        if (object.isFluffy === "true") {
            template.innerHTML = `<span class='id'>ID: ${object.id}</span>
            						  <span>${object.name}</span>
                                      <span class="fluffy">is fluffy.</span>`;
        }

        return template;
    }

    buildList(collection, type, list) {
        collection.forEach(element => {
            let p = this.getTemplate(element, type);
            if (list === 'cat') {
                this.allCatsList.appendChild(p);
            }
            if (list === 'price') {
                this.priceGreaterThanAvgList.appendChild(p);
            }
            if (list === 'fluffy') {
                this.fluffyOrWhiteList.appendChild(p);
            }
        });
    }

    displayField(animalClass, container) {
        let petName = container.querySelector('.petName'),
            petFluffy = container.querySelector('.petFluffy');

        if (animalClass === 'dog') {
            this.removeClass('hidden', petName);
            if (![...petFluffy.classList].includes('hidden')) {
                this.addClass(' hidden', petFluffy)
            }
        } else if (animalClass === 'cat') {
            this.removeClass('hidden', petName, petFluffy);
        } else if (animalClass === 'hamster') {
            this.addClass(' hidden', petName);
            this.removeClass('hidden', petFluffy);
        }
    }

    removeClass(className, inputFields) {
        let fields = [...arguments];
        fields = fields.splice(1);
        fields.forEach(field => field.classList.remove(className));
    }

    addClass(className, inputFields) {
        let fields = [...arguments].splice(1);
        fields.forEach(field => field.classList += className);
    }

    addPetForm() {
        let clonePet = document.querySelector('.petForm'),
            container = document.querySelector('.pets'),
            cloned = clonePet.cloneNode(true);

        container.appendChild(cloned);
        this.initListeners();
    }

    addHeadings() {
        let cats = document.querySelector('.allCatsList');
        let h2 = document.createElement('h3');
        h2.innerText = 'cats';
        cats.prepend(h2);

        let fluffyOrWhiteList = document.querySelector('.fluffyOrWhiteList');
        let h2fluffy = document.createElement('h3');
        h2fluffy.innerHTML = 'fluffy or <span>white</span>';
        fluffyOrWhiteList.prepend(h2fluffy);

        let price = document.querySelector('.priceGreaterThanAvgList');
        let h2price = document.createElement('h3');
        h2price.innerText = 'price > average';
        price.prepend(h2price);
    }
}

var counter = (function() {
    let counter = 0;
    return function() {
        return counter++;
    };
}());

let app = new PetShopController();