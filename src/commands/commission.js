const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('커미션')
        .setDescription('커미션 내용을 전송 합니다.')
        .addChannelOption(option =>
            option.setName('채널')
                .setDescription('커미션 내용을 전송할 채널을 선택하세요.')
                .setRequired(true)),

    async execute(interaction) {
        const channel = interaction.options.getChannel('채널'); // 선택한 채널

        // Embed 메시지 생성
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // 임베드 색상 설정
            .setTitle('**흑룡 영상 커미션 내용**')
            .addFields(
                { name: '📜 **커미션 소개**', value: `- 본 커미션은 영상 제작 커미션 입니다\n- 롱폼, 숏폼을 매인으로 해드리고 있으며\n- 커버곡은 서브로 소소하게 해드리고 있습니다\n- 해당 커미션은 슬롯제로 운영 됩니다`},
                { name: '✨ **편집 경력**', value: `- 블리즈 - 나나링 쇼츠 편집자 ( 2024.09 ~ )\n- 꽃감이 GAME | DRX YuRiHaNa 채널 영상 편집\n- BJ 하요이이 콘서트 ( 팬서비스, 이름에게 ), 구간단속 Hush 영상 제작\n- 썰레임 꿈의 악마 채널 - 쇼츠 편집\n- 유튜브 개인 채널 혼자서 운영중\n- 영상편집 관련 전문대 학생`},
                { name: '⏰ **영상 문의 시간대**', value: `- 연휴 기간에는 문의를 받지 않습니다 [ 추석, 설날 등 등 ]\n- 평일 : p.m 8시 ~ p.m 11시\n- 주말 : a.m 8시 ~ p.m 11시\n- 위의 시간대가 아닐 경우 답장이 늦어질 수 있습니다`},
                { name: '📞 **커미션 문의하는 방법**', value: `- 아트머그 : **[바로가기](https://artmug.kr/index.php?channel=view&uid=31001)**\n- 이메일 : **cjstk060207@naver.com**
                `},
                { name: '💾 **포트폴리오 보러가기**', value: '- **[외주 작업 재생목록 바로가기](https://www.youtube.com/watch?v=poXo9tmlGis&list=PLmo9irx_Jr6fOtNUFX0yGrMbiGkY35stJ)**'},
                { name: '🚫 **2차 수정 및 2차 배포 적발 시 영상 삭제 또는 영상 제작 비용 x10**', value: `- 이 사항은 주의 해주시길 바랍니다`},
                { name: '💎 **자세한 내용은 아트머그를 참고 해주세요**', value: '- **[아트머그 바로가기](https://artmug.kr/index.php?channel=view&uid=31001)**' }
            );

        // 선택한 채널에 Embed 메시지 전송
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: '커미션 내용이 전송되었습니다.', ephemeral: true });
    },
};
