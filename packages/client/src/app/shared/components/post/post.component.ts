import { Component, OnInit } from '@angular/core';
import {
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  User,
  Post
} from '@ngsocial/graphql/types';

import {
  RemovePostEvent,
  CommentEvent,
  ListCommentsEvent,
  MoreCommentsEvent,
  LikeEvent,
  DisplayLikesEvent
} from '../..';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  @Input() authUser: Partial<User> | null = null;
  @Input() commentsPerPost: number = 5;

  @Output()
  like = new EventEmitter<LikeEvent>();
  @Output()
  comment = new EventEmitter<CommentEvent>();
  @Output()
  listComments = new EventEmitter<ListCommentsEvent>();
  @Output()
  moreComments = new EventEmitter<MoreCommentsEvent>();
  @Output()
  remove = new EventEmitter<RemovePostEvent>();
  @Output()
  listLikes = new EventEmitter<DisplayLikesEvent>();

  @ViewChild('commentInput')
  commentInput!: ElementRef;
  commentsShown: boolean = false;
  
  constructor() { }
  ngOnInit(): void {
  }
  get latestLike(): string {
    return `${this.post?.likesCount ?? 0} Likes`;
  }
  displayLikes(): void {}
  displayComments(): void {}
  loadComments(): void {}
  sendLike(): void {}
  removePost(): void {}
  createComment(e: Event): void {}
}
