import { Component, Injector, OnInit } from '@angular/core';
import { Post } from '@ngsocial/graphql/types';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent extends BaseComponent {
  fetchMore!: () => void;
  constructor(injector: Injector) { 
    super(injector);
  }
  get authUserName() {
    return this.authUser
      ?.fullName
      ?.split(' ')
      ?.shift();
  }
  postComments(postId: string){
    return this.comments.get(postId)?.result!;
  }
  ngOnInit(): void {
    super.ngOnInit();
    const qRef = this.postService.getFeed();

    qRef.valueChanges.subscribe({
      next: (result) => {
        this.posts = result.data.getFeed as Post[];
        console.log('Posts', this.posts);
      }
    });

    this.fetchMore = () => {
      qRef.fetchMore({
        variables: {
          offset: this.posts.length
        }
      });
    }
  }

}
