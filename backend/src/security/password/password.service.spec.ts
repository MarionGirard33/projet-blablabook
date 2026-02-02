import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PasswordService } from 'src/security/password/password.service';

// Mock manuel du module argon2 avant tout
jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);

    // reset des mock
    jest.clearAllMocks();
  });

  describe('checkPassword', () => {
    it('should return true if argon2.verify returns true', async () => {
      // On caste en jest.Mock pour avoir accès aux méthodes de mock
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.checkPassword('hash', 'password');

      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenCalledWith('hash', 'password');
    });

    it('should return false if argon2.verify returns false', async () => {
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      const result = await service.checkPassword('hash', 'wrong_password');

      expect(result).toBe(false);
    });

    it('should return false and log error if argon2.verify throws', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (argon2.verify as jest.Mock).mockRejectedValue(
        new Error('Argon2 failure'),
      );

      const result = await service.checkPassword('bad_hash', 'password');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('hashPassword', () => {
    it('should return a hashed password on success', async () => {
      const mockHash = '$argon2id$v=19$m=65536...';
      (argon2.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await service.hashPassword('mypassword');

      expect(result).toBe(mockHash);
      expect(argon2.hash).toHaveBeenCalledWith('mypassword');
    });

    it('should throw InternalServerErrorException if hashing fails', async () => {
      (argon2.hash as jest.Mock).mockRejectedValue(new Error('CPU failure'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(service.hashPassword('pwd')).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
