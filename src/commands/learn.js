const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../../data.json');

// 데이터 파일 읽기
function loadData() {
    if (!fs.existsSync(dataFilePath)) return {};
    try {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    } catch (error) {
        console.error('❌ 데이터 파일 읽기 오류:', error);
        return {};
    }
}

// 데이터 저장
function saveData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('학습')
        .setDescription('봇이 특정 키워드에 대한 응답을 학습합니다.')
        .addStringOption(option => 
            option.setName('키워드')
                .setDescription('학습할 키워드')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('응답')
                .setDescription('키워드에 대한 응답')
                .setRequired(true)),

    async execute(interaction) {
        const keyword = interaction.options.getString('키워드').trim();
        const response = interaction.options.getString('응답').trim();

        let data = loadData();

        if (!data[keyword]) {
            data[keyword] = [];
        }

        if (!data[keyword].includes(response)) {
            data[keyword].push(response);
            saveData(data);
            await interaction.reply(`✅ \`${keyword}\`에 대한 응답이 추가되었습니다: \`${response}\``);
        } else {
            await interaction.reply(`⚠️ 이미 존재하는 응답입니다.`);
        }
    }
};
