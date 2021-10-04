import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export type UserResponse = {
  getUser: User;
};
export type UsersResponse = {
  searchUsers: User[];
};
export type SearchUsersResponse = {
  data: Observable<UsersResponse>;
  fetchMore: (users: User[]) => void
};