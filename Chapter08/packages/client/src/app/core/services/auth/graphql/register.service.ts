import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import { RegisterResponse, REGISTER_MUTATION } from 'src/app/shared';

@Injectable({
  providedIn: 'root',
})
export class RegisterGQL extends Mutation<RegisterResponse> {
  document = REGISTER_MUTATION;
}
