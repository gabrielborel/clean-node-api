export type AuthenticationModel = {
  email: string;
  password: string;
};

export interface Authentication {
  auth(data: AuthenticationModel): Promise<string | null>;
}
