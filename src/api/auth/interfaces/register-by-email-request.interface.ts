export interface RegisterByEmailRequest extends Express.Request {
    body: { email: string , password: string }
}