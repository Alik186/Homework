// Задача 1.
// Создайте объект person с несколькими свойствами, содержащими информацию о вас. Затем выведите значения этих свойств в консоль.

// Задача 2.
// Создайте функцию isEmpty, которая проверяет является ли переданный объект пустым. Если объект пуст - верните true, в противном случае false.

// Задача 3.
// Создайте объект task с несколькими свойствами: title, description, isCompleted.
// Напишите функцию cloneAndModify(object, modifications), которая с помощью оператора spread создает копию объекта и применяет изменения из объекта modifications.
// Затем с помощью цикла for in выведите все свойства полученного объекта.

// Задача 4.
// Создайте функцию callAllMethods, которая принимает объект и вызывает все его методы.

// Пример использования:
// const myObject = {
//     method1() {
//         console.log('Метод 1 вызван');
//     },
//     method2() {
//         console.log('Метод 2 вызван');
//     },
//     property: 'Это не метод'
// };
// callAllMethods(myObject);

//Задача 1
const person = {
	name: "Александр",
	age: 28,
	city: "Петропавловск",
	profession: "студент, фрилансер (верстка)",
};

console.log(person.name);
console.log(person.age);
console.log(person.city);
console.log(person.profession);

//Задача 2
function isEmpty(obj) {
	return Object.keys(obj).length === 0;
}

console.log(isEmpty({})); // true
console.log(isEmpty({ a: 1 }));

//Задача 3
const task = {
	title: "Сделать домашку",
	description: "Разобраться с объектами",
	isCompleted: false,
};

function cloneAndModify(object, modifications) {
	return { ...object, ...modifications };
}

const updatedTask = cloneAndModify(task, { isCompleted: true });

for (const key in updatedTask) {
	console.log(`${key}: ${updatedTask[key]}`);
}

//Задача 4

javascript;
function callAllMethods(obj) {
	for (const key in obj) {
		if (typeof obj[key] === "function") {
			obj[key]();
		}
	}
}

const myObject = {
	method1() {
		console.log("Метод 1 вызван");
	},
	method2() {
		console.log("Метод 2 вызван");
	},
	property: "Это не метод",
};

callAllMethods(myObject);
