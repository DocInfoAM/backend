import {checkSchema} from "express-validator";

export const createUserByEmailSchema = checkSchema({
    email: {
        isEmail: { errorMessage: 'Некорректный email' },
    },
})

export const createUserByPhoneNumberSchema = checkSchema({
    email: {
        isMobilePhone: { errorMessage: 'Некорректный мобильный номер' },
    },
})