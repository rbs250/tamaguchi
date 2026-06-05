const CACHE_NAME = "tamaguchi-v14";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/tamaguchi-device.png",
  "./assets/tamaguchi-device-cutout.png",
  "./assets/key-a-web.png",
  "./assets/key-b-web.png",
  "./assets/key-c-web.png",
  "./assets/lcd/pet-egg.png",
  "./assets/lcd/pet-baby.png",
  "./assets/lcd/pet-child.png",
  "./assets/lcd/pet-teen.png",
  "./assets/lcd/pet-adult-mame.png",
  "./assets/lcd/pet-adult-kuchi.png",
  "./assets/lcd/pet-adult-mask.png",
  "./assets/lcd/pet-adult-nyoro.png",
  "./assets/lcd/menu-status-v2.png",
  "./assets/lcd/menu-food-v2.png",
  "./assets/lcd/menu-game-v2.png",
  "./assets/lcd/menu-clean-v2.png",
  "./assets/lcd/menu-med-v2.png",
  "./assets/lcd/menu-light-v2.png",
  "./assets/lcd/menu-discipline-v2.png",
  "./assets/lcd/menu-attention-v2.png",
  "./assets/lcd/obj-poop.png",
  "./assets/lcd/obj-meal.png",
  "./assets/lcd/obj-snack.png",
  "./assets/lcd/obj-med.png",
  "./assets/lcd/obj-sparkle.png",
  "./assets/lcd/obj-sick.png",
  "./assets/lcd/obj-sleep.png",
  "./assets/lcd/obj-bubbles.png",
  "./assets/lcd/obj-heart.png",
  "./assets/lcd/obj-tear.png",
  "./assets/lcd/obj-clock.png",
  "./assets/lcd/obj-battery.png",
  "./assets/lcd/game-cup-left.png",
  "./assets/lcd/game-cup-right.png",
  "./assets/lcd/game-star.png",
  "./assets/lcd/game-ball.png",
  "./assets/lcd/game-flag.png",
  "./assets/lcd/game-burst.png",
  "./assets/lcd/game-arrow-left.png",
  "./assets/lcd/game-arrow-right.png",
  "./assets/lcd/emo-smile.png",
  "./assets/lcd/emo-sad.png",
  "./assets/lcd/emo-sick.png",
  "./assets/lcd/emo-angry.png",
  "./assets/lcd/emo-sleepy.png",
  "./assets/lcd/emo-alert.png",
  "./assets/lcd/emo-music.png",
  "./assets/lcd/emo-heart.png",
  "./assets/lcd/emo-crack.png",
  "./assets/lcd/emo-call.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("./index.html"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
