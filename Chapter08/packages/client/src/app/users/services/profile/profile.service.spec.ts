import { TestBed } from '@angular/core/testing';
import { SetUserBioDocument, SetUserCoverDocument, SetUserPhotoDocument } from '@ngsocial/graphql/documents';
import { User } from '@ngsocial/graphql/types';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let controller: ApolloTestingController;
  const fakeImage = {
    name: 'FA4d9zHWUAQNxHu.jpeg',
    type: 'image/jpeg'
  } as unknown as File;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule]
    });
    service = TestBed.inject(ProfileService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set user bio', (done) => {
    const bio = 'This is a bio';
    const mockResult = {
      setUserBio: {
        id: 'id#1',
        bio: bio
      } as User
    };
    service.setUserBio(bio)
      .subscribe({
        next: (result) => {
          expect(result)
            .toEqual(mockResult.setUserBio);
          done();
        }
      });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions)
        .toEqual(SetUserBioDocument.definitions);
      return true;
    });
    expect(op.operation.variables.bio)
      .toEqual(bio);
    op.flush({
      data: mockResult
    });
  });
  it('should set user photo', (done) => {
    const image = 'url_of_image';
    const mockResult = {
      setUserPhoto: {
        id: 'id#1',
        image: image
      } as User
    };
    service.setUserPhoto(fakeImage)
      .subscribe({
        next: (result) => {
          expect(result)
            .toEqual(mockResult.setUserPhoto);
          done();
        }
      });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions)
        .toEqual(SetUserPhotoDocument.definitions);
      return true;
    });
    expect(op.operation.variables.file)
      .toEqual(fakeImage);
    op.flush({
      data: mockResult
    });
  });
  it('should set user profile cover', (done) => {
    const image = 'url_of_image';
    const mockResult = {
      setUserCover: {
        id: 'id#1',
        image: image
      } as User
    };
    service.setUserCover(fakeImage)
      .subscribe({
        next: (result) => {
          expect(result)
            .toEqual(mockResult.setUserCover);
          done();
        }
      });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions)
        .toEqual(SetUserCoverDocument.definitions);
      return true;
    });
    expect(op.operation.variables.file)
      .toEqual(fakeImage);
    op.flush({
      data: mockResult
    });
  });  
});
