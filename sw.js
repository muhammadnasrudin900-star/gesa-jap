
const CACHE_NAME = "gesa-jap-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./gesa-jap-logo.jpg"
];

// Firebase Cloud Messaging
importScripts(
  "https://www.gstatic.com/firebasejs/13.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/13.2.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAZ83cqqBwdVb4nuAOmBFgkIgwujaQtkYE",
  authDomain: "gesa-jap.firebaseapp.com",
  projectId: "gesa-jap",
  storageBucket: "gesa-jap.firebasestorage.app",
  messagingSenderId: "88780634057",
  appId: "1:88780634057:web:af30298fa7a3cb5ef19a18"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title =
    payload.notification?.title || "GESA JAP";

  const options = {
    body: payload.notification?.body || "Ada pemberitahuan baru.",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    data: {
      url: "./"
    }
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("./")
  );
});

// Cache aplikasi lama
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request)
    )
  );
});
