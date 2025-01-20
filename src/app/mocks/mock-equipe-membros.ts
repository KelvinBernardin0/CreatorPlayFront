import { EquipeMembrosModel } from 'src/app/models/equipe/equipe-membros';

export const mockEquipeMembros: EquipeMembrosModel[] = [
  {
    id: 1,
    idTeam: 1,
    idUser: 1,
    email: 'fulano@mail.com',
    dateInclusion: new Date('2023-01-01T00:00:00Z'),
    userAdded: 1,
    departureDate: new Date('9999-12-31T23:59:59Z')
  },
  {
    id: 2,
    idTeam: 1,
    idUser: 2,
    email: 'fulano2@mail.com',
    dateInclusion: new Date('2023-01-02T00:00:00Z'),
    userAdded: 1,
    departureDate: new Date('9999-12-31T23:59:59Z')
  },
  {
    id: 3,
    idTeam: 2,
    idUser: 3,
    email: 'fulano3@mail.com',
    dateInclusion: new Date('2023-02-01T00:00:00Z'),
    userAdded: 2,
    departureDate: new Date('9999-12-31T23:59:59Z')
  },
  {
    id: 4,
    idTeam: 2,
    idUser: 4,
    email: 'fulano4@mail.com',
    dateInclusion: new Date('2023-02-02T00:00:00Z'),
    userAdded: 2,
    departureDate: new Date('9999-12-31T23:59:59Z')
  }
];
