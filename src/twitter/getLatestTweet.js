const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

require("dotenv").config();

const TWITTER_USERNAME = "bjblackdragon";
const DISCORD_CHANNEL_ID = "1287733386177155072";
const LAST_TWEET_FILE = path.join(__dirname, "lastTweetId.txt");

// 프로필 이미지 경로
const PROFILE_IMAGE_PATH = path.join(__dirname, "images", "profile2.png");

// 마지막으로 전송한 트윗 ID 불러오기
let lastTweetId = fs.existsSync(LAST_TWEET_FILE) ? fs.readFileSync(LAST_TWEET_FILE, "utf8").trim() : null;

// RSS 파서 초기화
const parser = new Parser();

async function getLatestTweet() {
    console.log("🔍 트위터 RSS 확인 중...");

    try {
        const rssFeedUrl = `https://rsshub.app/twitter/user/${TWITTER_USERNAME}`;
        const feed = await parser.parseURL(rssFeedUrl);

        if (!feed.items || feed.items.length === 0) {
            console.log("❌ 최신 트윗을 찾을 수 없음.");
            return null;
        }

        const latestTweet = feed.items[0];

        let tweetType = "일반 트윗"; // 기본값 (일반 트윗)
        let authorText = `📢 ${TWITTER_USERNAME} 님의 새로운 트윗!`;
        let embedColor = "#1DA1F2"; // 기본값: 파란색
        const tweetText = latestTweet.contentSnippet || "(내용 없음)";

        // 트윗에 포함된 미디어 이미지 URL 가져오기
        const mediaRegex = /(https?:\/\/pbs.twimg.com\/media\/[^\s]+)/;
        const mediaMatch = latestTweet.content.match(mediaRegex);
        const imageUrl = mediaMatch ? mediaMatch[0] : null;

        // 리트윗 감지 (RT @username: 이 포함된 경우)
        if (tweetText.startsWith("RT @")) {
            tweetType = "리트윗";
            authorText = `🔁 ${TWITTER_USERNAME} 님이 리트윗함!`;
            embedColor = "#2ECC71"; // 초록색
        }
        // 인용 트윗 감지 (트윗 내용에 트위터 링크가 포함된 경우)
        else if (tweetText.includes("https://twitter.com/")) {
            tweetType = "인용 트윗";
            authorText = `💬 ${TWITTER_USERNAME} 님이 인용함!`;
            embedColor = "#F1C40F"; // 노란색
        }

        return {
            id: latestTweet.link.split("/").pop(),
            type: tweetType,
            text: tweetText,
            url: latestTweet.link,
            date: latestTweet.pubDate,
            authorText,
            imageUrl,
            color: embedColor, // 트윗 유형별 색상 추가
        };
    } catch (error) {
        console.error("❌ RSS에서 트윗을 가져오는 중 오류 발생:", error.message);
        return null;
    }
}

async function checkTweetAndNotify(client) {
    try {
        const latestTweet = await getLatestTweet();
        if (!latestTweet || latestTweet.id === lastTweetId) {
            console.log("⏭️ 새로운 트윗 없음.");
        } else {
            lastTweetId = latestTweet.id;
            fs.writeFileSync(LAST_TWEET_FILE, lastTweetId, "utf8"); // 트윗 ID 저장

            const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
            if (!channel) {
                console.error("❌ 디스코드 채널을 찾을 수 없음.");
                return;
            }

            const profileImage = new AttachmentBuilder(PROFILE_IMAGE_PATH, { name: "profile_icon.jpg" });

            // Embed 메시지 생성
            const embed = new EmbedBuilder()
                .setColor(latestTweet.color) // 트윗 유형별 색상 적용
                .setTitle(`📢 ${latestTweet.type}이 올라왔습니다!`)
                .setDescription(`${latestTweet.text}\n\n해당 알림은 딜레이가 있음을 알려드립니다\n[🔗 원본 트윗 보러가기](${latestTweet.url})`)
                .setAuthor({
                    name: latestTweet.authorText,
                    url: `https://twitter.com/${TWITTER_USERNAME}`
                })
                .setThumbnail("attachment://profile_icon.jpg")
                .setTimestamp(new Date());

            // 트윗에 이미지가 포함되어 있을 경우 추가
            if (latestTweet.imageUrl) {
                embed.setImage(latestTweet.imageUrl);
            }

            await channel.send({ embeds: [embed], files: [profileImage] });
            console.log(`✅ ${latestTweet.type}이 전송됨.`);
        }

        // 🔹 5분 후 다시 실행
        setTimeout(() => checkTweetAndNotify(client), 5 * 60 * 1000);

    } catch (error) {
        console.error("❌ 오류 발생:", error.message);

        // 🔹 429 오류가 발생하면, 10분 후 재시도
        if (error.message.includes("429")) {
            console.log("🚨 요청 제한 도달! 10분 후 다시 시도...");
            setTimeout(() => checkTweetAndNotify(client), 10 * 60 * 1000);
        } else {
            // 다른 오류 발생 시 5분 후 재시도
            setTimeout(() => checkTweetAndNotify(client), 5 * 60 * 1000);
        }
    }
}

module.exports = checkTweetAndNotify;
