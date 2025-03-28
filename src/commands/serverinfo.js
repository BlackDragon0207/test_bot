const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('이용약관')
        .setDescription('이용약관을 보여줍니다.')
        .addChannelOption(option =>
            option.setName('채널')
                .setDescription('이용약관을 전송할 채널을 선택하세요.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // 관리자만 사용 가능

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({ content: '🚫 **이 명령어는 관리자만 사용할 수 있습니다.**', ephemeral: true });
        }

        const channel = interaction.options.getChannel('채널'); // 선택한 채널

        // Embed 메시지 생성
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // 임베드 색상 설정
            .setTitle(':scroll: **BlackDragon Community**')
            .addFields(
                { name: ':gear: **커뮤니티 운영자**', value: '`blackdragon0207 (435800525389430804)`' },
                { name: '💾 **서버 봇 개발자**', value: '`blackdragon0207 (435800525389430804)\nyunaribr (616570697875193866)`'},
                { name: ':octagonal_sign: **주의사항**', value: `
                    - 커뮤니티 내에서 대화 중 상대방을 불쾌하게 하는 발언은 자제해주세요\n- 채널에 맞게 채팅을 해주세요\n- everyone 및 here는 관리자 이외에는 사용 금지\n- (알림 자체는 막았으나 사용할려고 할 시 경고가 부여됩니다)\n- 홍보방을 제외한 모든 채팅방에는 홍보성 링크 업로드를 금지합니다\n- 맵 공유방에서 맵 공유 관련 링크는 허용됩니다
                `},
                { name: ':crossed_swords: **처벌 관련 내용**', value: `
                    - 위 사항을 지키지 않을 시 경고 또는 뮤트, 심할 경우 즉각 밴 처리가 됩니다\n- 경고가 5가 될 시 서버에서 영구밴 처리가 됩니다
                `},
                { name: ':ballot_box_with_check: **멤버십 인증**', value: `
                    - 멤버십을 가입한 유튜브 계정과 디스코드 계정을 연동하시면 멤버십 역할이 지급됩니다
                `},
                { name: '✅ **디스코드 가이드라인**', value: `
                    - 디스코드 가이드라인을 준수해주세요 **[바로가기](https://discord.com/guidelines)**
                `},
                { name: ':envelope_with_arrow:  **서버 초대 링크**', value: `
                    - **[ https://discord.com/invite/XCpAAYY ]**
                `},
                { name: ':calendar_spiral: **마지막 수정일**', value: '2024.05.19' }
            );

        // 선택한 채널에 Embed 메시지 전송
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: '✅ 이용약관이 전송되었습니다.', ephemeral: true });
    },
};
