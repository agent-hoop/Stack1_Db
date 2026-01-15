import {createClient} from 'redis'

const redis = createClient({
    url:"rediss://red-d5jq4cemcj7s738hq290:AEOMkEvRCpwZ4kYPOsJ7OOO0sCo7dRyD@oregon-keyvalue.render.com:6379"
})

redis.on("error",(err)=>{
    console.error({err});
    
})
await redis.connect();

export default redis