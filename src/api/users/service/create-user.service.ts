import {userRepository} from "../repositories";
import assert from "assert";

export async function createUserByEmail (email: string) {
    try {
        const user = userRepository.create({identity: email, providerType: 'email'})
        const insertUserResult = await userRepository.insert(user)
        const userObj = insertUserResult.identifiers.pop()
        assert.ok(userObj, '')
        return { userId: userObj.id }
    } catch (error) {
        throw new Error(`Error during user creation | => ${error instanceof Error ? error.message : ''}`)
    }
}