const { getYoutubeStats } = require('./youtubeStats');

const VOICE_CHANNEL_IDS = {
    subscribers: '1081556744116916354',
    videos: '1288091732377866261',
    views: '1288091748962406412'
};

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

async function updateVoiceChannelNames(client) {
    const stats = await getYoutubeStats();
    if (!stats) return;

    const { subscriberCount, videoCount, viewCount } = stats;

    try {
        const subscriberChannel = await client.channels.fetch(VOICE_CHANNEL_IDS.subscribers);
        await subscriberChannel.setName(`🔴 구독자 | ${formatNumber(subscriberCount)}명`);

        const videosChannel = await client.channels.fetch(VOICE_CHANNEL_IDS.videos);
        await videosChannel.setName(`🎬 영상 | ${formatNumber(videoCount)}개`);

        const viewsChannel = await client.channels.fetch(VOICE_CHANNEL_IDS.views);
        await viewsChannel.setName(`📈 조회수 | ${formatNumber(viewCount)}회`);

        console.log(`음성 채널 업데이트 완료: 구독자(${formatNumber(subscriberCount)}), 영상(${formatNumber(videoCount)}), 조회수(${formatNumber(viewCount)})`);
    } catch (error) {
        console.error('음성 채널 이름 업데이트 중 오류 발생:', error);
    }
}

module.exports = { updateVoiceChannelNames };
