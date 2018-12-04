var newsTopicEl = document.getElementById('news-topic');
var newsTextEl = document.getElementById('news-text');

var allTopicEl = document.getElementById('all-topic')
var secondTopicEl = document.getElementById('second-topic')
var firstTopicEl = document.getElementById('first-topic')



let subscriptionsClient = new 
    window
        .SubscriptionsTransportWs
        .SubscriptionClient('ws://192.168.43.27:9696/api/graphql/news', {
            reconnect: true
        }
);


subscriptionsClient.onReconnected(()=>{
    console.log('reconnected to subscription server')
})

subscriptionsClient.onConnected(()=>{
    console.log('connected to subscription server')
    subscriptionsClient.request({
        query:`subscription onNewsTopic($tName: String!) {
            subscribeNewsTopic(topicName: $tName) {
                newsTopic
                newsText
            }
        }`,
        variables:{
            tName:'FIRST_TOPIC'
        }
    }).subscribe({
        next({data}){
            $(firstTopicEl).append(`
                <div>
                    <h5>Only first topics here</h5>
                    <div>
                        ${data.subscribeNewsTopic.newsTopic}
                    </div>
                    <div>
                        ${data.subscribeNewsTopic.newsText}
                    </div>
                </div>
            `)
        }
    })
    subscriptionsClient.request({
        query:`subscription {
            subscribeNews {
                newsTopic
                newsText
            }
        }`
    }).subscribe({
        next:({data})=>{
            $(allTopicEl).append(`
                <div>
                    <h5>All topic without filtering</h5>
                    <div>
                        ${data.subscribeNews.newsTopic}
                    </div>
                    <div>
                        ${data.subscribeNews.newsText}
                    </div>
                </div>
            `)
        }
    })
})



function addNews(){

    var newsTopic = newsTopicEl.value;
    var newsText = newsTextEl.value;

    fetch('http://192.168.43.27:9696/api/graphql/news',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
            query:`
                mutation mPushNews($nInput: NewsInput!){
                    pushNews(newsInput: $nInput) {
                        newsTopic
                        newsText
                    }
                }
            `,
            variables:{
                nInput:{
                    newsTopic,
                    newsText
                }
            }
        })
    })
        .then(r=> r.json())
        .then(rJson=>{
            newsTextEl.value = ''
            newsTopicEl.value = ''
        })
        .catch(err=>{
            console.error(err)

            newsTextEl.value = ''
            newsTopicEl.value = ''
        })
}

