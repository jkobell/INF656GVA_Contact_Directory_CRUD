import { body } from 'express-validator';
export { newContactValidator, updateContactValidator };

const newContactValidator = [
    body('name', 'Name is not valid.').not().isEmpty().trim().isAlpha('en-US', {ignore: '\s'}).escape(),
    body('phone', 'Phone number is not valid.').not().isEmpty().isMobilePhone('en-US').escape(),
    body('email', 'Email is not valid.').not().isEmpty().isEmail().normalizeEmail(),
    body('region', 'Region is not valid.').not().isEmpty().trim().isAlpha('en-US', {ignore: '\s'}).escape()
]

const updateContactValidator = [
    body('id', 'Id is not valid.').not().isEmpty().isNumeric().escape(),
    body('name', 'Name is not valid.').not().isEmpty().trim().isAlpha('en-US', {ignore: '\s'}).escape(),
    body('phone', 'Phone number is not valid.').not().isEmpty().isMobilePhone('en-US').escape(),
    body('email', 'Email is not valid.').not().isEmpty().isEmail().normalizeEmail(),
    body('region', 'Region is not valid.').not().isEmpty().trim().isAlpha('en-US', {ignore: '\s'}).escape()
]