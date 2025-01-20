import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import{EquipeService} from '../../services/equipe/equipe.service'
import { AuthService } from 'src/app/services/helpService/Auth.service';
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
@Component({
  selector: 'app-equipe-membros',
  templateUrl: './equipe-membros.component.html',
  styleUrls: ['./equipe-membros.component.css']
})
export class EquipeMembrosComponent {
  emailControl = new FormControl('');
  selectedMembers: { idUser: string, email: string }[];
  private timeId:Number=0;
  public userId;
  public leaderId;

  constructor(
    public dialogRef: MatDialogRef<EquipeMembrosComponent>,
    public equipeService:EquipeService,
    public notificacaoService:NotificacaoService,
    public authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { timeId:Number,leaderId:String,membros: { idUser: string, email: string }[] }
  ) {
    this.selectedMembers = this.data?.membros || [];
    this.timeId = this.data?.timeId || [];
    this.leaderId= data?.leaderId;
    this.userId = authService.getStoredUserId();

    console.log("leader: ", this.leaderId)
    console.log("userId: ", this.userId)
  }

  adicionarMembro(): void {
    const email = this.emailControl.value?.trim();
    
    let teste =this.selectedMembers.some(member => member.email === email);
    
    if (email && !this.selectedMembers.some(member => member.email === email)) {
      this.equipeService.adicionarMembro(email, this.timeId).subscribe(
        (data: any) => {
          
          this.selectedMembers.push({idUser:"",email:email})
          this.emailControl.reset()
        },
        (error) => {
          this.notificacaoService
          .AlertaErro('Erro', error.error.message, 'OK')
          .then(() => {});
  
        }
      );



    }
  }

  removeMembro(member: { idUser: string, email: string }): void {


    this.equipeService.removerMembro(member.idUser, this.timeId).subscribe(
      (data: any) => {
        
        const index = this.selectedMembers.indexOf(member);
          if (index >= 0) {
            
            this.selectedMembers.splice(index, 1);

          }
      },
      (error) => {
         console.log(error)
      }
    );
  }

  salvaListaMembros(): void {
    this.dialogRef.close(this.selectedMembers);
  }

  cancela(): void {
    this.dialogRef.close();
  }
}
