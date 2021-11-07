import { Injectable } from '@angular/core';
import {
  SetUserCoverGQL,
  SetUserPhotoGQL,
  SetUserBioGQL
} from 'src/app/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private setUserBioGQL: SetUserBioGQL,
    private setUserPhotoGQL: SetUserPhotoGQL,
    private setUserCoverGQL: SetUserCoverGQL
  ) { }
  setUserBio(bio: string) {
    return this.setUserBioGQL.mutate({
      bio: bio
    }).pipe(map(result => result.data!.setUserBio));
  }
  setUserPhoto(photoImage: File) {
    return this.setUserPhotoGQL.mutate({
      file: photoImage
    },
      {
        context: {
          useMultipart: true
        }
      }).pipe(map(result => result.data!.setUserPhoto));
  }
  setUserCover(coverImage: File) {
    return this.setUserCoverGQL.mutate({
      file: coverImage
    },
      {
        context: {
          useMultipart: true
        }
      }).pipe(map(result => result.data!.setUserCover));
  }
}