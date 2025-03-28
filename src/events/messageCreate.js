const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data.json');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return; // 봇 메시지는 무시
        console.log(`📩 감지된 메시지: ${message.content}`);

        // 데이터 파일 로드
        let data = {};
        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }

        // 사용자가 학습된 키워드를 입력하면 랜덤으로 응답
        const responses = data[message.content];
        if (responses) {
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            message.reply(randomResponse);
        }
    });
};
