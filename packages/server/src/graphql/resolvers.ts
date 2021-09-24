import { IResolvers } from '@graphql-tools/utils'; 

const resolvers: IResolvers = { 
  Query: { 
    message: () => 'It works!' 
  } 
}; 
export default resolvers; 