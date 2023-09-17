
export interface CreateUserByEmailRequest extends Express.Request {
    body: { email: string }
}