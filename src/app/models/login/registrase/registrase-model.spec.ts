import { RegistraseModel } from './registrase-model';

describe('RegistraseModel', () => {
  it('should create', () => {
    const model: RegistraseModel = {
      usuario: 'test',
      email: 'test@example.com',
      senha: 'password',
      confirmacaoSenha: 'password'
    };
    expect(model).toBeTruthy();
  });
});
