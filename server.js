const app = require('express')()
const {createServer} = require('http')
const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const initNewsData = []

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context:{
        newsData:initNewsData
    },
    subscriptions:{
        path:'/api/graphql/news'
    }
})

apolloServer.applyMiddleware({
    app,
    path:'/api/graphql/news',
    cors:true
})

const httpServer = createServer(app)
apolloServer.installSubscriptionHandlers(httpServer)


httpServer
    .listen(9696,()=>{
        console.log(`Server running at http://localhost:9696${apolloServer.graphqlPath}`)
        console.log(`Subscription path at ws://localhost:9696${apolloServer.subscriptionsPath}`)
    })


