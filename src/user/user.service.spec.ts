import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

describe.only('UserService', () => {
  let service: UserService;

  const users = [
    { username: 'a' },
    { username: 'b' },
    { username: 'c' },
    { username: null },
  ];

  const mockRepository = {
    findOne: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('Save', () => {
    it('Should save user', async () => {
      mockRepository.findOne
        .mockReturnValueOnce(undefined)
        .mockReturnValue(users[0]);

      expect(await service.save(users[0])).toEqual(users[0]);
    });

    it('Should not save user', async () => {
      mockRepository.findOne.mockReturnValue(users[0]);

      expect(service.save(users[0])).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Find by username', () => {
    it('Should return user by username', async () => {
      mockRepository.findOne.mockReturnValue(users[0]);

      expect(await service.findByUsername('a')).toEqual(users[0]);
    });

    it('Should not return user', () => {
      mockRepository.findOne.mockReturnValue(undefined);
      expect(service.findByUsername('a')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Edit', () => {
    it('Should return user edited', async () => {
      mockRepository.findOne
        .mockReturnValueOnce(users[0])
        .mockReturnValueOnce(undefined)
        .mockReturnValue({ username: 'b' });

      expect(await service.edit(1, users[1])).toEqual(users[1]);
    });

    it('Should not return user edited', () => {
      mockRepository.findOne.mockReturnValue(undefined);

      expect(service.edit(1, users[0])).rejects.toThrow(NotFoundException);
    });

    it('Should not return user edited', () => {
      mockRepository.findOne
        .mockReturnValueOnce(users[0])
        .mockReturnValue(users[1]);

      expect(service.edit(1, users[1])).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Delete', () => {
    it('Should deleted user', async () => {
      mockRepository.findOne.mockReturnValue(users[0]);

      expect(await service.delete(1)).toEqual({
        message: 'Usuário deletado com sucesso',
      });
    });

    it('Should not delete user', () => {
      mockRepository.findOne.mockReturnValue(undefined);

      expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
