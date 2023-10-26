self.addEventListener('install', function (e) {
  console.log('fcm sw install..');
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  console.log('fcm sw activate..');
});

let messageData;
self.addEventListener('push', function (e) {
  console.log('push: ', e.data.json());
  if (!e.data.json()) return;

  const resultData = e.data.json();

  // 변경: 푸시 알림의 데이터에서 제목과 내용 가져오기
  const notificationTitle = resultData.notification.title;
  const notificationBody = resultData.notification.body;
  messageData = resultData.data;

  const notificationOptions = {
    body: notificationBody,
    // 변경: 제목과 아이콘을 설정
    icon: '/path/to/icon.png', // 여기에 알림 아이콘 이미지 경로를 설정하세요.
  };
  console.log('push: ', { resultData, notificationTitle, notificationOptions });

  // 변경: 알림을 표시할 때 "resultData" 대신 "notificationTitle"과 "notificationOptions" 사용
  self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener('notificationclick', function (event) {
  console.log('notification click');
  console.log(messageData);
  const defaultUrl = '/';
  event.notification.close();
  event.waitUntil(
    clients.openWindow(
      messageData && messageData.url ? messageData.url : defaultUrl
    )
  );
});
