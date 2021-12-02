import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  CreatePostGQL,
  RemovePostGQL,
  UploadFileGQL
} from 'src/app/core';
import { Apollo } from 'apollo-angular';
import {
  GetPostsByUserIdDocument,
  GetPostsByUserIdQuery,
  GetPostsByUserIdQueryVariables
} from '@ngsocial/graphql/documents'; 
import { Post } from '@ngsocial/graphql/types';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private createPostGQL: CreatePostGQL,
    private removePostGQL: RemovePostGQL,
    private uploadFileGQL: UploadFileGQL,
    private apollo: Apollo) { }

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
      }, {refetchQueries: ['getUser']})
      .pipe(map(result => result.data!.removePost));
  }
  getPostsByUserId(
    userId: string,
    offset?: number,
    limit?: number) {

    const queryRef = this.apollo
      .watchQuery<
        GetPostsByUserIdQuery,
        GetPostsByUserIdQueryVariables>({
          query: GetPostsByUserIdDocument,
          variables: {
            userId: userId,
            offset: offset || 0,
            limit: limit || 10
          },
          fetchPolicy: 'cache-and-network',
        });
    return queryRef;
  }
}
