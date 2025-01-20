import { EquipeModel } from 'src/app/models/equipe/equipe-model';

export const mockEquipes: EquipeModel[] = [
  {
    id: 1,
    name: 'Equipe Alpha',
    description: 'Equipe focada em desenvolvimento de software.',
    leaderId:"017c2554-e70b-42e4-b2d4-6e5bed0c6f63" ,
    creator:"017c2554-e70b-42e4-b2d4-6e5bed0c6f64",
    createDate: new Date('2023-01-01T00:00:00Z'),
    deactivationDate: new Date('9999-12-31T23:59:59Z')
  },
  {
    id: 2,
    name: 'Equipe Beta',
    description: 'Equipe de marketing e vendas.',
    leaderId:"017c2554-e70b-42e4-b2d4-6e5bed0c6f64" ,
    creator:"017c2554-e70b-42e4-b2d4-6e5bed0c6f64",
    createDate: new Date('2023-02-01T00:00:00Z'),
    deactivationDate: new Date('9999-12-31T23:59:59Z')
  }
];
