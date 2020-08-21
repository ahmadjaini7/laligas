const webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BPUn4bjEWiuHPlrJV37aA1QhhZRtKsbkKa4iPa86hhgpzGLHvd-bW3rUhZFKkg0Ns1bF05x3YkOo7pyHiTQpAHM",
    "privateKey": "zl221_WW_jgO8uwmOs2EDO-bDE7oJs9bdBaEXmkPfYc"
};


webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/egMdKtBbKMk:APA91bGhNcO-lg07GQIxVnAgfD3BBAOjgpXlzZGt28GemKgatmnksrKy-wZczMHx0g5eKOuHpccl8RMPdj2u0avOxHvjd_ySs3B17UxOB7o_PgqqAu_p1dCOz3fD79pGW5md7kDctcMI",
    "keys": {
        "p256dh": "BLw5B2+Frg1ZetAQ2iQJiNAVNZ8gBIZT4nbY8qSPxlOPHumdZ+3r2bMrQ7eDu55ub0jTsC7rcR0HTsF202mZcWY=",
        "auth": "cnZVre6rFGa3dDojHKvZ+w=="
    }
};
const payload = 'Anda menampilkan Notifikasi dari payload';

const options = {
    gcmAPIKey: '383815661857',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);