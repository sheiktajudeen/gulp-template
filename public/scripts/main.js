class Person{
    constructor(name){
        this.name = name;
    }
    hello(){
        if(typeof this.name === 'string') {
            return 'Hello, I am ' + this.name + '!';
        }else{
            return 'Hello';
        }
    }
}

var person = new Person('Sheik');
var greetHTML = templates['greeting']({
   message: person.hello()
});
// var name = 'Sheik';

// document.write('Hello ' + name + '!');

document.write(greetHTML);