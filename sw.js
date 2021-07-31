console.log('--cccc--')
const CACHE_NAME = 'cache_v3'

// 用来缓存内容
self.addEventListener('install', async e => {
  //c
  console.log('install', e)

  const cache = await caches.open(CACHE_NAME)

  // cache就可以存取资源
  try {
    await cache.addAll(['./mainifest.json', './'])
  } catch (error) {
    console.log('e', error)
  }
  // 进入激活
  await self.skipWaiting()
})

// 清楚旧的缓存
self.addEventListener('activate', async e => {
  console.log('activate', e)

  const keys = await caches.keys()
  keys.forEach(key => {
    if (key !== CACHE_NAME) {
      caches.delete(key)
    }
  })

  // 获取控制权
  await self.clients.claim()
})

// fetch在请求发送的时候会触发
self.addEventListener('fetch', async e => {
  console.log('fetch')
  // console.log(e.request)
  const req = e.request
  // const res = await
  e.respondWith(networkFirst(req))
})

async function networkFirst(req) {
  try {
    const fresh = await fetch(req)
    return fresh
  } catch (error) {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(req)
    return cached
  }
}

async function catchFirst(req) {}
