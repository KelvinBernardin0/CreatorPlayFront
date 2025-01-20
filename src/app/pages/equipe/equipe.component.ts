import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EquipeModel } from 'src/app/models/equipe/equipe-model';
import { EquipeMembrosModel } from 'src/app/models/equipe/equipe-membros';
import { mockEquipes } from 'src/app/mocks/mock-equipes';
import { mockEquipeMembros } from 'src/app/mocks/mock-equipe-membros';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EquipeMembrosComponent } from '../equipe-membros/equipe-membros.component';
import{EquipeService} from '../../services/equipe/equipe.service'
import { NotificacaoService } from 'src/app/services/helpService/notificacao.service';
import { AuthService } from 'src/app/services/helpService/Auth.service';
@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent {
  abaAtiva: string = 'CriarEquipe';
  perfilForm: FormGroup;
  showSpinner: boolean = false;
  equipe: EquipeModel = new EquipeModel();
  equipes: Array<EquipeModel> = new Array<EquipeModel>();
  // equipes: EquipeModel[] = mockEquipes;
  equipeMembros: EquipeMembrosModel[] = mockEquipeMembros;
  displayedColumns: string[] = ['name', 'description', 'members',  'excluir'];
  membrosFiltrados: { [key: string]: EquipeMembrosModel[] } = {};
  editingIndex: number | null = null;
  private readonly equipesSubject = new BehaviorSubject<EquipeModel[]>([]);
  equipes$ = this.equipesSubject.asObservable();
  public userId;
  constructor(private readonly fb: FormBuilder, private dialog: MatDialog, public equipeService:EquipeService,public notificacaoService:NotificacaoService,public authService:AuthService) 
  {
    this.userId = authService.getStoredUserId();
    this.buscarEquipes()
  this.perfilForm = this.fb.group({
      nome: [''],
      descricao: ['']
    });
    this.equipes$.subscribe(equipes => {
      this.equipes = equipes || [];
      this.filtrarMembros();
    });
  }
  buscarEquipes(){
    this.equipeService.listarEquipes().subscribe((data:any)=>{this.equipes = data;}, (error) => {})
   
  }
  selecionarAba(aba: string) {
    this.abaAtiva = aba;
  }

  criarEquipe() {
    this.showSpinner = true;
    // setTimeout(() => {

    // }, 3000); // Simula um tempo de espera de 3 segundos
    // this.equipe.id = this.equipes.length + 1;
    this.equipe.name = this.perfilForm.value.nome;
    this.equipe.description = this.perfilForm.value.descricao;
    this.equipe.leaderId = this.equipe.creator; // Assumindo que o criador é o líder
    //const novasEquipes = [...this.equipes, { ...this.equipe }];
    //this.equipesSubject.next(novasEquipes);

    this.equipeService.criarEquipe(this.equipe).subscribe(
      (data: any) => {
        this.buscarEquipes()
        this.equipe = new EquipeModel(); // Resetar o formulário
        this.perfilForm.reset();
        this.showSpinner = false;

      },
      (error) => {
        this.showSpinner = false;
        this.notificacaoService
        .AlertaErro('Erro', error.error.message, 'OK')
        .then(() => {});


      }
    );
  }

  filtrarMembros() {
    this.equipes.forEach(equipe => {
      this.membrosFiltrados[equipe.id.toString()] = this.equipeMembros.filter(m => m.idTeam === equipe.id);
    });
  }

  addMembro(equipe: EquipeModel) {
    // Lógica para adicionar membro
    this.filtrarMembros();
  }

  removeMembro(equipe: EquipeModel) {
    // Lógica para remover membro
    this.filtrarMembros();
  }

  deletaEquipe(equipe: EquipeModel) {


    this.equipeService.deletarEquipe(equipe.id).subscribe(
      (data: any) => {
        const novasEquipes = this.equipes.filter(e => e.id !== equipe.id);
        this.equipesSubject.next(novasEquipes);
   
      },
      (error) => {
        this.showSpinner = false;

        this.notificacaoService
        .AlertaErro('Erro', error.error.message, 'OK')
        .then(() => {});

      }
    );
  }

  editaEquipe(index: number) {
    this.editingIndex = index;
  }

  salvaEdicao() {
    this.editingIndex = null;
    // Lógica para salvar as edições
  }

  abreModalMembros(equipe: EquipeModel): void {
    let membros= {}
        this.equipeService.listarMembrosDaEquipe(equipe.id).subscribe(
      (data: any) => {
        this.showSpinner = false;
        membros =data[0].members.map((x:any)=>{return   {idUser:x.id,email:x.email}});
        const dialogRef = this.dialog.open(EquipeMembrosComponent, {
          width: '400px',
          data: {timeId:equipe.id, membros, leaderId:equipe.leaderId }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Atualize a lista de membros da equipe com o resultado
            this.membrosFiltrados[equipe.id.toString()] = result;
          }
        });
      },
      (error) => {
        this.showSpinner = false;
        this.notificacaoService
        .AlertaErro('Erro', error.error.message, 'OK')
        .then(() => {});

      }
    );

  }
}
