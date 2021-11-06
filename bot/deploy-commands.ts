import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [
    new SlashCommandBuilder().setName('test').setDescription("It's a test friend"),
    new SlashCommandBuilder().setName('stats').setDescription('See emoji usage stats'),
    new SlashCommandBuilder().setName('mute').setDescription('Mute live fantasy updates'),
    new SlashCommandBuilder().setName('unmute').setDescription('unmute live fantasy updates'),
    new SlashCommandBuilder().setName('rittard').setDescription('Most points on the bench'),
    new SlashCommandBuilder()
        .setName('luckernoob')
        .setDescription('Most points autosubbed in from the bench'),
    new SlashCommandBuilder().setName('pope').setDescription('Fakkings pope'),
    new SlashCommandBuilder().setName('baitley').setDescription('Lol'),
    new SlashCommandBuilder().setName('var').setDescription('Mike dean take the wheel'),
].map((command) => command.toJSON());

const token = process.env.TOKEN || '';
const applicationId = process.env.CLIENT_ID || '';
const guildId = process.env.PREIK_GUILD_ID || '';
// const guildId = '774731038391140375';

const rest = new REST({ version: '9' }).setToken(token);

// Get all commands
rest.get(Routes.applicationGuildCommands(applicationId, guildId))
    .then((response) => console.log('commands', response))
    .catch(console.error);

// Delete commands
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '905922427521994762'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906230669586362369'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906234817450999959'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906234817450999960'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525840'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525841'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525842'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525843'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525844'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525841'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525842'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525843'));
// rest.delete(Routes.applicationGuildCommand(applicationId, guildId, '906257361889525844'));

// rest.put(Routes.applicationGuildCommands(clientId, guildId), {
//     body: commands,
// })
//     .then(() => console.log('Successfully registered application commands.'))
//     .catch(console.error);
