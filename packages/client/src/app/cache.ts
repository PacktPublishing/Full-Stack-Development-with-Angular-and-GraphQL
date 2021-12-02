import { InMemoryCache } from '@apollo/client/core';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { authState } from './reactive';

export default new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                authState: {
                    read() {
                        return authState();
                    }
                },
                getPostsByUserId: offsetLimitPagination(['userId'])
            }
        },
        User: {
            fields: {
                coverImage: {
                    read(coverImage) {
                        return `url(${coverImage})`;
                    }
                },
                createdAt: {
                    read(createdAt) {
                        return new Date(Number(createdAt))
                            .toLocaleDateString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                month: 'long'
                            });
                    }
                }
            }
        }
    }
});
