const { check } = require('express-validator');

module.exports = [
	check('login.user_name', 'Имя пользователя должно содержать не менее 5 символов.').exists().isLength({ min:5 }),
	check('login.password', 'Минимальная длина пароля должна быть 8.').exists().isLength({ min:8 }),
	check('full_name', 'Полное имя должно быть не менее 5 символов..').exists().isLength({ min:5 })
];
