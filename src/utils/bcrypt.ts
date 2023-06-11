import { hash, compare } from 'bcrypt';
export class Bcrypt {
  static async hashPassword(password: string): Promise<string> {
    const salt = 10;
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const res = await compare(password, hashedPassword);
    return res;
  }
}
