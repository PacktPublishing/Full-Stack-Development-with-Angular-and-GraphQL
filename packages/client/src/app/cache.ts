import { InMemoryCache } from '@apollo/client/core';
import { authState } from './reactive';

export default new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                authState: {
                    read() {
                        return authState();
                    }
                }
            }
        }
    }
});