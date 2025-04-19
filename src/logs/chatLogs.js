// logs/chatLogs.js
const { EmbedBuilder } = require('discord.js');

// 로그를 전송할 채널 ID와 특정 서버 ID 설정
const chatLogChannelId = "1331965454079623220"
const targetGuildId = process.env.guildId;

module.exports = function(client) {
    // 메시지 수정 로그
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (oldMessage.partial || newMessage.partial) return;
        if (oldMessage.content === newMessage.content) return;
        if (!oldMessage.guild || oldMessage.guild.id !== targetGuildId) return;

        const logChannel = client.channels.cache.get(chatLogChannelId);
        if (logChannel && logChannel.isTextBased()) {
            const messageLink = `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`;

            const embed = new EmbedBuilder()
                .setTitle('✅ 메시지 수정 로그')
                .setColor('#FFFF00')
                .setDescription(`<@${oldMessage.author.id}> (${oldMessage.author.tag}) 이(가) 메시지를 수정했습니다:`)
                .addFields(
                    { name: '> **채널**', value: `<#${oldMessage.channel.id}> (${oldMessage.channel.id})` },
                    { name: '> **메시지**', value: `[바로가기](${messageLink})` },
                    { name: '> **수정전 내용**', value: `${oldMessage.content || '없음'}` },
                    { name: '> **수정후 내용**', value: `${newMessage.content || '없음'}` },
                )
                .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `메세지가 수정 되었습니다` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    });

    // 메시지 삭제 로그
    client.on("messageDelete", async (message) => {
        if (!message || !message.guild || message.guild.id !== targetGuildId) return;
        if (!message.author || message.author.bot) return;

        const logChannel = client.channels.cache.get(chatLogChannelId);
        if (logChannel && logChannel.isTextBased()) {
            const messageLink = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

            const embed = new EmbedBuilder()
                .setTitle('❌ 메시지 삭제 로그')
                .setColor('#FF0000')
                .setDescription(`<@${message.author.id}> (${message.author.tag})가 메시지를 삭제했습니다.`)
                .addFields(
                    { name: '> **채널**', value: `<#${message.channel.id}> (${message.channel.id})` },
                    { name: '> **내용**', value: `${message.content || '내용 없음'}` },
                )
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: `메세지가 삭제 되었습니다.` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        }
    });
};
