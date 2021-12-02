import * as Operations from '@ngsocial/graphql/documents';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';

  @Injectable({
    providedIn: 'root'
  })
  export class GetCommentsByPostIdGQL extends Apollo.Query<Operations.GetCommentsByPostIdQuery, Operations.GetCommentsByPostIdQueryVariables> {
    document = Operations.GetCommentsByPostIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class CommentPostGQL extends Apollo.Mutation<Operations.CommentPostMutation, Operations.CommentPostMutationVariables> {
    document = Operations.CommentPostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveCommentGQL extends Apollo.Mutation<Operations.RemoveCommentMutation, Operations.RemoveCommentMutationVariables> {
    document = Operations.RemoveCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class GetLikesByPostIdGQL extends Apollo.Query<Operations.GetLikesByPostIdQuery, Operations.GetLikesByPostIdQueryVariables> {
    document = Operations.GetLikesByPostIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class LikePostGQL extends Apollo.Mutation<Operations.LikePostMutation, Operations.LikePostMutationVariables> {
    document = Operations.LikePostDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveLikeGQL extends Apollo.Mutation<Operations.RemoveLikeMutation, Operations.RemoveLikeMutationVariables> {
    document = Operations.RemoveLikeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

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
  export class GetPostsByUserIdGQL extends Apollo.Query<Operations.GetPostsByUserIdQuery, Operations.GetPostsByUserIdQueryVariables> {
    document = Operations.GetPostsByUserIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }

  @Injectable({
    providedIn: 'root'
  })
  export class GetFeedGQL extends Apollo.Query<Operations.GetFeedQuery, Operations.GetFeedQueryVariables> {
    document = Operations.GetFeedDocument;
    
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