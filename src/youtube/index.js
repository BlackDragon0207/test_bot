
const { checkLiveStream } = require('./youtubeLiveNotifier');
const { checkLatestVideo } = require('./youtubeNotifier')

async function startYoutubeNotifier() {
    console.log('유튜브 알림 기능 시작!');

    await checkLiveStream();
    await checkLatestVideo();

    setInterval(async () => {
        await checkLiveStream();
        await checkLatestVideo();
    }, 5 * 60 * 1000); // 5분마다 실행
}

module.exports = { startYoutubeNotifier };
