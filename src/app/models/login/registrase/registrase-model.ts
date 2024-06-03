export interface RegistraseModel {
  cnpj: string;
  telefone: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
}

export interface RegistraseRhModel {
  cnpj: string;
  // chaveDeCadastro: string;
  telefone: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
}

export interface ValidarCnpjModel {
  cnpj: string;
}
