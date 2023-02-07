import * as bcrypt from 'bcrypt';

export class AuthenticationProvider {
  static async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async compareHash(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
