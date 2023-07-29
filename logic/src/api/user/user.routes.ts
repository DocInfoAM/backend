/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - phone
 *
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированное поле, уникальный идентификатор пользователя
 *         email:
 *           type: string
 *           description: E-mail пользователя
 *         passwordHash:
 *           type: string
 *           description: хэш пароля
 *         userType:
 *           type: string
 *           description: Тип пользователя - пациент, врач, администратор
 *         createdAt:
 *           type: string
 *           format: date
 *           description: Дата, когда пользователь был добавлен в БД
 *       example:
 *         id: c3a0ab6f-3979-4eb1-844b-a3dd63e70419
 *         email: user@mail.ru
 *         passwordHash: bbf13ae4db87d475ca0ee5f97e397248a23509fc10c82f1e3cf110
 *         userType: doctor
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

import express from "express";
import { getAllUsers } from "./user.handlers";

export const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API для управления пользователями
 * /users:
 *   post:
 *     summary: Создание нового пользователя
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Пользователь успешно создан.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка сервера
 *
 */
userRouter.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
});

userRouter.post("/", async (req, res) => {
    const data = req.body;
    const users = await getAllUsers();
    res.json(users);
});
