const {PubSub, withFilter} = require('apollo-server')
const pubsub = new PubSub()




module.exports = {
    Query:{
        listNews(_, __ , {newsData}){
            return newsData
        },
        listNewsByTopicName(_ , {name}, {newsData}){
            return newsData.filter(f=>(
                f.newsTopic === name
            ))
        }
    },
    Subscription:{
        subscribeNews:{
            subscribe: ()=> pubsub.asyncIterator('ON_UPDATED_NEWS')
        },
        subscribeNewsTopic:{
            subscribe: withFilter(
                ()=> pubsub.asyncIterator('ON_NEW_TOPIC'),
                (data,args)=>{
                    return data.subscribeNewsTopic.newsTopic === args.topicName
                }
            )
        }
    },
    Mutation:{
        pushNews(_,  {newsInput} , {newsData}){
            pubsub.publish('ON_UPDATED_NEWS',{
                subscribeNews:newsInput
            })
            pubsub.publish('ON_NEW_TOPIC',{
                subscribeNewsTopic:newsInput
            })

            newsData.push(newsInput)
            return newsInput
        }
    }
}