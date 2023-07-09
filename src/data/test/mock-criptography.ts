import { Hasher } from "@/data/protocols/criptography/hasher";
import { Decrypter } from "@/data/protocols/criptography/decrypter";
import { Encrypter } from "@/data/protocols/criptography/encrypter";
import { HashComparer } from "@/data/protocols/criptography/hash-comparer";

export const mockHasher = (): Hasher => {
  class HasherMock implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }
  return new HasherMock();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string | null> {
      return "any_value";
    }
  }
  return new DecrypterStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return "access_token";
    }
  }
  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};
