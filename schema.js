const {gql} = require('apollo-server')


module.exports = gql(`
    type Query {
        listNews: [News]
        listNewsByTopicName(name: String!): [News]
    }

    type Mutation {
        pushNews(newsInput: NewsInput!): News!
    }

    input NewsInput  {
        newsTopic: String!
        newsText: String!
    }

    type News {
        newsTopic: String!
        newsText: String!
    }

    type Subscription {
        subscribeNews: News
        subscribeNewsTopic(topicName: String!): News
    }
`)