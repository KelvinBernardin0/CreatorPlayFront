import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly baseUrl = environment.apiURL;

  constructor(private httpClient: HttpClient) {}

  uploadImageToApi(formData: FormData, imageName: string): Observable<any> {
    const data = new FormData();
    data.append('ImageFile', formData.get('file') as File);
    data.append('ImageName', imageName);

    return this.httpClient.post<any>(
      `${this.baseUrl}/api/v1/images/upload`,
      data,
      {
        headers: {
          'Accept': 'text/plain',
        },
      }
    );
  }
}
