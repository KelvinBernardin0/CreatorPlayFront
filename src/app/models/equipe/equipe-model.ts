export class EquipeModel {
  id : Number = 0
  name: string = '';
  description: string = '';
  // isLeader: boolean = false;
  leaderId:string = '';
  creator:string = '';
  createDate: Date = new Date();
  deactivationDate: Date = new Date();
 // active: boolean = true;
 /**
  *
  */
 constructor() {
  this.description='';
  
 }

}
