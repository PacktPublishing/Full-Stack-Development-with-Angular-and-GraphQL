import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { User }
  from '@ngsocial/graphql/types';
import { PostEvent }
  from 'src/app/shared';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  @Input() authUser!: Partial<User>;
  @Input() loading: boolean = false;
  @Output() post: EventEmitter<PostEvent> = new EventEmitter();
  public imageFile: File | null = null;
  @ViewChild('postText') postText!: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }
  get userFirstName() {
    return this.authUser
      ?.fullName
      ?.split(' ')
      ?.shift();
  }
  onFileSelected(event: Event): void {
    const files: FileList =
      (event.target as HTMLInputElement)
        .files!;
    if (files.length > 0) {
      this.imageFile = files[0];
    }
  }

  handlePostClick(): void {
    if (this.authUser!.id) {
      this.post.emit({
        text: this.postText?.nativeElement.value,
        image: this.imageFile as File
      });
    }
    if (this.postText.nativeElement) {
      this.postText.nativeElement.value = '';
    }
    this.imageFile = null;
  }
}
