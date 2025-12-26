// Service Worker for Game Hub
// 提供离线访问和缓存功能

const CACHE_NAME = 'game-hub-v3-FINAL-FIX-' + Date.now(); // 使用时间戳强制刷新
const urlsToCache = [
  '/Games/',
  '/Games/index.html',
  '/Games/styles.css',
  '/Games/main.js',
  '/Games/manifest.json'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing FINAL version...');
  // 强制跳过等待，立即激活
  self.skipWaiting();
  
  // 不缓存任何文件，让浏览器直接从服务器加载
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[Service Worker] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new version...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即接管所有页面
      return self.clients.claim();
    })
  );
});

// 拦截请求 - 直接从网络获取，不使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log('[Service Worker] Fetch failed:', event.request.url);
    })
  );
});

