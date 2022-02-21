import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { RemoveCommentEvent }
  from '../../types/removecomment.event';
import { Comment }
  from '@ngsocial/graphql/types';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment | null = null;
  @Output() removeComment: EventEmitter<RemoveCommentEvent>
    = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  remove() {
    this.removeComment.emit({
      id: this.comment?.id ?? ''
    })
  }
}
