import { InMemoryCache } from '@apollo/client/core';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { authState } from './reactive';
import * as timeago from 'timeago.js';

export default new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                authState: {
                    read() {
                        return authState();
                    }
                },
                searchUsers: offsetLimitPagination(),
                getPostsByUserId: offsetLimitPagination(['userId']),
                getCommentsByPostId: offsetLimitPagination(['id', 'postId']),
                getFeed: offsetLimitPagination()
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
        },
        Post: {
            fields: {
                createdAt: {
                    read(createdAt) {
                        return timeago.format(createdAt)
                    }
                }
            }
        }, 
        Comment: {
            fields: {
                createdAt: {
                    read(createdAt) {
                        return timeago.format(createdAt)
                    }
                }
            }
        }
    }
});
