import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing.module';
import { PostsComponent } from './components/posts/posts.component';
import { SharedModule } from '../shared/shared.module'; 

@NgModule({
  declarations: [
    PostsComponent
  ],
  imports: [
    CommonModule,
    FeedRoutingModule,
    SharedModule
  ]
})
export class FeedModule { }
