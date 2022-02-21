import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import { LOGIN_MUTATION } from '../../../../shared';
import { LoginResponse } from '../../../../shared';


@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Mutation<LoginResponse> {
  document = LOGIN_MUTATION;
}
