import bcryptjs from "bcryptjs";

export const hashPassword = (password: string): string => bcryptjs.hashSync(password);
export const compareHash = (password: string, hash: string): boolean =>
    bcryptjs.compareSync(password, hash);