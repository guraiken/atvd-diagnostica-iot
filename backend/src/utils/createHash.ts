const saltRound = 12;
import { hash } from "bcrypt"

export async function createHash(password: string) {
    return await hash(password, saltRound)
}
