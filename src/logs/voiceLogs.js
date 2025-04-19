// logs/voiceLogs.js
const { EmbedBuilder } = require('discord.js');

// 로그를 전송할 채널 ID와 특정 서버 ID 설정
const voiceLogChannelId = "1331965454079623220";
const targetGuildId = process.env.guildId;

module.exports = function(client) {
    client.on('voiceStateUpdate', (oldState, newState) => {
        const user = newState.member?.user;
        if (!user || user.bot) return;

        const guild = newState.guild;
        if (!guild || guild.id !== targetGuildId) return;

        const logChannel = client.channels.cache.get(voiceLogChannelId);
        if (!logChannel || !logChannel.isTextBased()) return;

        // 유저가 음성 채널에 접속한 경우
        if (!oldState.channelId && newState.channelId) {
            const embed = new EmbedBuilder()
                .setTitle('📥 유저 음성 채널 접속 로그')
                .setColor('#00FF00')
                .setDescription(`<@${user.id}> (${user.tag}) 이(가) **${newState.channel?.name ?? '알 수 없음'}** 채널에 접속했습니다.`)
                .addFields(
                    { name: '> **채널**', value: `<#${newState.channelId}> (${newState.channelId})` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: '음성 채널에 접속했습니다.' })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }

        // 유저가 음성 채널에서 나간 경우
        if (oldState.channelId && !newState.channelId) {
            const embed = new EmbedBuilder()
                .setTitle('📤 유저 음성 채널 나감 로그')
                .setColor('#FF0000')
                .setDescription(`<@${user.id}> (${user.tag}) 이(가) **${oldState.channel?.name ?? '알 수 없음'}** 채널에서 나갔습니다.`)
                .addFields(
                    { name: '> **채널**', value: `<#${oldState.channelId}> (${oldState.channelId})` }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: '음성 채널에서 나갔습니다.' })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    });
};
