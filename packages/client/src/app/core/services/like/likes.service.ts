import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  LikePostGQL,
  RemoveLikeGQL,
  GetLikesByPostIdGQL
} from '../../gql.services';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(
    private likePostGQL: LikePostGQL,
    private removeLikeGQl: RemoveLikeGQL,
    private getLikesGQL: GetLikesByPostIdGQL) { }
  likePost(postId: string) {
    return this.likePostGQL
      .mutate({
        postId: postId
      }).pipe(map(result => result.data!.like));
  }
  removeLike(postId: string) {
    return this.removeLikeGQl
      .mutate({
        postId: postId
      })
      .pipe(map(result => result.data!.removeLike));
  }
  getLikesByPostId(postId: string, offset?: number, limit?: number) {
    const queryRef = this.getLikesGQL.watch({
      postId: postId,
      offset: offset || 0,
      limit: limit || 10
    },
      {
        fetchPolicy: 'cache-and-network'
      }
    );
    return queryRef;
  }
}
