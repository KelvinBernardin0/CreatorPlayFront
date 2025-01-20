import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EquipeModel } from 'src/app/models/equipe/equipe-model';
@Injectable({
  providedIn: 'root'
})
export class EquipeService {
private readonly baseUrl = environment['apiURL'];

constructor(private readonly httpClient: HttpClient) { }

criarEquipe(equipe: EquipeModel): Observable<any> {
  return this.httpClient.post<any>(
    `${this.baseUrl}/api/v1/team`,
    equipe
  );
}
listarEquipes(): Observable<EquipeModel> {
  return this.httpClient.get<EquipeModel>(
    `${this.baseUrl}/api/v1/team`  );
} 
listarMembrosDaEquipe( equipeId:Number): Observable<any>{
return this.httpClient.get<any>(
  `${this.baseUrl}/api/v1/TeamMember/${equipeId}`  );
}
deletarEquipe(equipeId:Number){
  return this.httpClient.delete<any>(
    `${this.baseUrl}/api/v1/team/${equipeId}`);
}
adicionarMembro(email:string,equipeId:Number,isLeader:boolean=false): Observable<any>{
  return this.httpClient.post<any>(
    `${this.baseUrl}/api/v1/TeamMember`,{
      "UserEmail":email,
      "IsLeader":isLeader,
      "TeamId":equipeId
  } );
  }
  removerMembro(UserId:string,equipeId:Number){
    return this.httpClient.patch<any>(
      `${this.baseUrl}/api/v1/TeamMember/leaveTeam`,{
        "UserId":UserId,
        "TeamId":equipeId
    } );
  }
}
