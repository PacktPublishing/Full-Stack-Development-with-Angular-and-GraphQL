import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  CreatePostGQL,
  RemovePostGQL,
  UploadFileGQL
} from 'src/app/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private createPostGQL: CreatePostGQL,
    private removePostGQL: RemovePostGQL,
    private uploadFileGQL: UploadFileGQL) { }

  uploadFile(image: File) {
    return this.uploadFileGQL.mutate(
      {
        file: image
      },
      {
        context: {
          useMultipart: true
        }
      }).pipe(map(result => result.data!.uploadFile));
  }
  createPost(text: string | null, image: string | null) {
    return this.createPostGQL
      .mutate({
        text: text,
        image: image
      })
      .pipe(map(result => result.data!.post));
  }
  removePost(id: string) {
    return this.removePostGQL
      .mutate({
        id: id
      })
      .pipe(map(result => result.data!.removePost));
  }
}
