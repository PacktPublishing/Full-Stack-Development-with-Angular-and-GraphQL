import { Injectable } from '@angular/core';
import { StoreObject } from '@apollo/client/core';
import { map } from 'rxjs/operators';
import {
  CommentPostGQL,
  RemoveCommentGQL,
  GetCommentsByPostIdGQL
} from '../../gql.services';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
    private commentPostGQL: CommentPostGQL,
    private removeCommentGQL: RemoveCommentGQL,
    private getCommentsByPostIdGQL: GetCommentsByPostIdGQL) { }
  createComment(
    comment: string,
    postId: string) {
    return this.commentPostGQL
      .mutate({
        comment: comment,
        postId: postId
      })
      .pipe(map(result => result.data!.comment));
  }
  removeComment(id: string) {
    return this.removeCommentGQL
      .mutate({
        id: id
      })
      .pipe(map(result => result.data!.removeComment));
  }
  getCommentsByPostId(
    postId: string,
    offset?: number,
    limit?: number) {
    const queryRef = this.getCommentsByPostIdGQL
      .watch(
        {
          postId: postId,
          offset: offset || 0,
          limit: limit || 10
        }, {
        fetchPolicy: 'cache-and-network'
      });
    return queryRef;
  }
}
