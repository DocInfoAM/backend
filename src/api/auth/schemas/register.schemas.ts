import {checkSchema} from "express-validator";

export const registerByEmailSchema = checkSchema({
    email: {
        isEmail: { errorMessage: 'Некорректный email' },
    },
    password: {
        isString: { errorMessage: 'Должно быть строкой' },
    }
})