// Задача 1.
// Напишите функцию calculateFinalPrice, которая принимает базовую цену товара, процент скидки и налоговую ставку. Функция должна вычислять скидку, затем прибавлять налог и возвращать итоговую цену.

// Пример работы:
// console.log(calculateFinalPrice(100, 10, 0.2)); // 108
// console.log(calculateFinalPrice(100, 10, 0)); // 90

// Задача 2.
// Напишите функцию checkAccess, которая принимает имя пользователя и пароль. Если имя пользователя равно "admin" и пароль равен "123456", функция должна возвращать строку "Доступ разрешен", иначе — "Доступ запрещен".

// Задача 3.
// Напишите функцию getTimeOfDay, которая принимает текущее время (число от 0 до 23) и возвращает строку:
// "Ночь" (с 0 до 5 часов),
// "Утро" (с 6 до 11 часов),
// "День" (с 12 до 17 часов),
// "Вечер" (с 18 до 23 часов).
// Если введённое значение не попадает в этот диапазон, возвращайте `"Некорректное время"`.

// Задача 4.
// Напишите функцию findFirstEven, которая принимает два числа start и end и находит первое чётное число в указанном диапазоне.
// Если чётного числа в этом диапазоне нет, функция должна вернуть "Чётных чисел нет".

// Пример работы:
// console.log(findFirstEven(1, 10)); // 2
// console.log(findFirstEven(9, 9)); // "Чётных чисел нет"

//Задача 1

function calculateFinalPrice(basePrice, discountPercent, taxRate) {
	const priceAfterDiscount = basePrice * (1 - discountPercent / 100);
	const finalPrice = priceAfterDiscount * (1 + taxRate);
	return finalPrice;
}

console.log(calculateFinalPrice(100, 10, 0.2));
console.log(calculateFinalPrice(100, 10, 0));

//Задача 2

function checkAccess(username, password) {
	if (username === "admin" && password === "123456") {
		return "Доступ разрешен";
	}
	return "Доступ запрещен";
}

//Задача 3

function getTimeOfDay(hour) {
	if (hour < 0 || hour > 23) {
		return "Некорректное время";
	}
	if (hour >= 0 && hour <= 5) return "Ночь";
	if (hour >= 6 && hour <= 11) return "Утро";
	if (hour >= 12 && hour <= 17) return "День";
	return "Вечер";
}

//Задача 4

function findFirstEven(start, end) {
	for (let i = start; i <= end; i++) {
		if (i % 2 === 0) {
			return i;
		}
	}
	return "Чётных чисел нет";
}

console.log(findFirstEven(1, 10));
console.log(findFirstEven(9, 9));
