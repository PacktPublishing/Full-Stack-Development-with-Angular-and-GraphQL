import * as Operations from '@ngsocial/graphql/documents';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';

  @Injectable({
    providedIn: 'root'
  })
  export class UploadFileGQL extends Apollo.Mutation<Operations.UploadFileMutation, Operations.UploadFileMutationVariables> {
    document = Operations.UploadFileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class CreatePostGQL extends Apollo.Mutation<Operations.CreatePostMutation, Operations.CreatePostMutationVariables> {
    document = Operations.CreatePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class RemovePostGQL extends Apollo.Mutation<Operations.RemovePostMutation, Operations.RemovePostMutationVariables> {
    document = Operations.RemovePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class SetUserPhotoGQL extends Apollo.Mutation<Operations.SetUserPhotoMutation, Operations.SetUserPhotoMutationVariables> {
    document = Operations.SetUserPhotoDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class SetUserCoverGQL extends Apollo.Mutation<Operations.SetUserCoverMutation, Operations.SetUserCoverMutationVariables> {
    document = Operations.SetUserCoverDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class SetUserBioGQL extends Apollo.Mutation<Operations.SetUserBioMutation, Operations.SetUserBioMutationVariables> {
    document = Operations.SetUserBioDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }