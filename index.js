const { AttachmentBuilder, ActivityType, Client, GatewayIntentBits, Events, Partials, Collection, EmbedBuilder, ClientUser, messageLink } = require('discord.js');
//const { token, logChannelId } = require('./config.json');
const path = require('path');
const { readdirSync } = require('fs');
const fs = require('fs');
require('dotenv/config');
const checkInHandler = require('./src/events/message'); // 출첵 이벤트 핸들러 추가
const memberEventsHandler = require('./src/events/member'); // 입퇴장 이벤트 핸들러 추가
//const { updateVoiceChannelNames } = require('./src/youtube/updateVoiceChannels');
//const { startYoutubeNotifier } = require('./src/youtube');
const messageCreateHandler = require('./src/events/messageCreate'); // messageCreate 이벤트 핸들러 추가
const checkTweetAndNotify = require("./src/twitter/getLatestTweet");
//startYoutubeNotifier();

// 클라이언트 초기화
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions, // 이모티콘 반응 감지
        GatewayIntentBits.GuildVoiceStates, // 보이스 감지
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ],
});

client.commands = new Collection();

// 에러 로그 함수 추가
async function sendErrorLog(errorMessage) {
    console.error(`[ERROR LOG] ${errorMessage}`);
    // 추가적인 로깅 로직이 필요하면 여기에 구현
    // 예: 특정 채널에 에러 메시지 전송
    // const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
    // if (logChannel) {
    //     await logChannel.send(`⚠️ 오류 발생: ${errorMessage}`);
    // }
}

// 명령어 파일 불러오기 - 절대 경로로 src/commands 지정
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.debug(`명령어 파일을 로드 중: ${commandFiles.length}개의 파일 발견`);

for (const file of commandFiles) {
    try {
        // 명령어 파일 로드 (src/commands 폴더에서)
        const command = require(path.join(commandsPath, file));
        if (command.data && command.data.name) {
            client.commands.set(command.data.name, command);
            console.debug(`명령어 로드 완료: ${command.data.name}`);
        } else {
            throw new Error(`명령어 파일 구조가 잘못되었습니다: ${file}`);
        }
    } catch (error) {
        console.error(`명령어 파일 로드 실패 (${file}):`, error);
        sendErrorLog(`명령어 파일 로드 실패 (${file}): ${error.message}`);
    }
}



// logs 폴더 안의 모든 파일을 읽어와서 모듈화된 코드로 실행
const logsPath = path.join(__dirname, 'src', 'logs');
fs.readdirSync(logsPath).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(logsPath, file))(client);
    }
});

const securityPath = path.join(__dirname, "src", "security");
const securityFiles = fs.readdirSync(securityPath).filter(file => file.endsWith(".js"));

for (const file of securityFiles) {
    const securityEvent = require(path.join(securityPath, file));
    if (securityEvent.name) {
        client.on(securityEvent.name, (...args) => securityEvent.execute(...args));
    }
}

// 봇 준비 이벤트
client.once('ready', async () => {
    checkInHandler(client); // 출첵 핸들러 등록
    memberEventsHandler(client); // 입퇴장 핸들러 등록
    checkTweetAndNotify(client);
    messageCreateHandler(client); // ✅ messageCreate 이벤트 핸들러 등록
        // 봇이 시작될 때 채널 이름 업데이트
        //updateVoiceChannelNames(client);

        // 이후 주기적으로 채널 이름 업데이트 (1시간마다)
        //setInterval(() => updateVoiceChannelNames(client), 60 * 60 * 1000);
        
    // 5분마다 트윗 확인
    setInterval(() => checkTweetAndNotify(client), 3 * 60 * 1000);
    const messages = [
        '흑룡 BLACKDRAGON',
        '정상 작동중'
    ];
    let current = 0;
    
    setInterval(() => {
        client.user.setPresence({
            activities: [{ name: `${messages[current]}`, type: ActivityType.Watching }],
            status: 'idle',
        });
        
        current = (current + 1) % messages.length;
    }, 7500);
        
    console.log(`${client.user.tag}로 로그인 되었습니다!`);
    console.debug(`현재 서버에 연결된 길드 수: ${client.guilds.cache.size}`);
});


// 명령어 인터랙션 이벤트
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    console.debug(`명령어 실행 요청: ${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.debug(`명령어를 찾을 수 없음: ${interaction.commandName}`);
        return;
    }
    try {
        await command.execute(interaction);
        console.debug(`명령어 실행 성공: ${interaction.commandName}`);
    } catch (error) {
        console.error(`명령어 실행 중 오류 발생: ${interaction.commandName}`, error);
        sendErrorLog(`명령어 실행 중 오류 발생: ${error.message}\n\n명령어: ${interaction.commandName}`);
        await interaction.reply({ content: '명령어 실행 중 오류가 발생했습니다.', ephemeral: true });
    }
});


// 클라이언트 로그인
client.login(process.env.token).then(() => {
    console.log('봇이 성공적으로 로그인 되었습니다.');
}).catch(error => {
    console.error('로그인 중 오류 발생:', error);
});


