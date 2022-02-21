import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { UserResponse, USER_QUERY } from 'src/app/shared';

@Injectable({
  providedIn: 'root',
})
export class GetUserGQL extends Query<UserResponse> {
  document = USER_QUERY;
}
