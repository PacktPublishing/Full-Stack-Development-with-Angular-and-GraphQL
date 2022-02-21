import { TestBed } from '@angular/core/testing';
import { CreatePostDocument, RemovePostDocument, UploadFileDocument } from '@ngsocial/graphql/documents';
import { User } from '@ngsocial/graphql/types';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';

import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule]
    });
    service = TestBed.inject(PostService);
    controller = TestBed.inject(ApolloTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should upload the file passed as argument', (done) => {
    const fakeImage = {
      name: "FA4d9zHWUAQNxHu.jpeg",
      type: "image/jpeg"
    } as unknown as File;
    const mockUploadResult = {
      uploadFile:
      {
        filename: 'FA4d9zHWUAQNxHu.jpeg',
        mimetype: 'image/jpeg',
        encoding: 'UTF-8',
        url: 'url_of_image'
      }
    };
    service.uploadFile(fakeImage)
      .subscribe({
        next: (result) => {
          expect(result)
            .toEqual(mockUploadResult.uploadFile);
          done();
        }
      });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions)
        .toEqual(UploadFileDocument.definitions);
      return true;
    });
    expect(op.operation.variables.file)
      .toEqual(fakeImage);
    op.flush({
      data: mockUploadResult
    });
  });
  it('should create a post', (done) => {
    const mockResult = {
      post: {
        id: 'id#1',
        text: 'A post',
        image: 'url_of_image',
        createdAt: '1633384405656',
        author: {
          postsCount: 1
        } as User
      }
    };
    service.createPost('A post', 'url_of_image')
      .subscribe({
        next: (result) => {
          expect(result)
            .toEqual(mockResult.post);
          done();
        }
      });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions)
        .toEqual(CreatePostDocument.definitions);
      return true;
    });
    expect(op.operation.variables.text)
      .toEqual('A post');
    expect(op.operation.variables.image)
      .toEqual('url_of_image');

    op.flush({
      data: mockResult
    });
  });

  it('should remove a post by ID', (done) => {
    const mockResult = {
      removePost: 'id#1'
    };
    service.removePost('id#1')
      .subscribe({
        next: (result) => {
          expect(result)
            .toEqual(mockResult.removePost);
          done();
        }
      });
    const op = controller.expectOne((operation) => {
      expect(operation.query.definitions)
        .toEqual(RemovePostDocument.definitions);
      return true;
    });
    expect(op.operation.variables.id)
      .toEqual('id#1');
    op.flush({
      data: mockResult
    });
  });
});
