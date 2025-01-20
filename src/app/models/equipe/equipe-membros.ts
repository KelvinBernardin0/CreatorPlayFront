export class EquipeMembrosModel {
  id: Number = 0;
  idTeam: Number = 0;
  idUser: Number = 0;
  email: string | undefined;
  dateInclusion: Date = new Date('0001-01-01T00:00:00Z');
  userAdded: Number = 0;
  departureDate: Date = new Date('0001-01-01T00:00:00Z');
}
