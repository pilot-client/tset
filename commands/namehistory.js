const mojangjs = require('mojangjs');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'namehistory',
	description: 'Get\'s the name history of a player.',
	args: true,
	usage: 'namehistory [username]',
	execute(message, args) {
		if (args.length === 1 && args[0] !== undefined) {
			mojangjs.getUUID(args[0], (err, uuid) => {
				if (err) console.error(err);
				mojangjs.nameHistory.byUUID(uuid, (err, namehistory) => {
					if (err) console.error(err);
					const playerHistory = new Discord.RichEmbed()
						.setTitle(`**${args[0]}'s** Name History`)
						.setThumbnail('https://visage.surgeplay.com/face/' + uuid)
						.setColor('#8c7ae6');

					let namehistory_length;
					let namehistory_changed;

					if (namehistory.length > 20) {
						namehistory_length = 20;
						namehistory_changed = true;
					} else {
						namehistory_length = namehistory.length;
						namehistory_changed = false;
					}

					for (let i = 0; i < namehistory_length; i++) {
						if (namehistory[i].changedToAt === undefined) {
							// the first name registered.
							playerHistory.addField('First Name Registered', namehistory[i].name);
						} else {
							// all other names.
							playerHistory.addField(`Changed on ${moment(parseInt(namehistory[i].changedToAt)).format('Do MMMM YYYY')}`, namehistory[i].name);
						}
					}

					if (namehistory_changed) {
						let allNames = '';
						for (let i = 0; i < namehistory.length; i++) {
							allNames += namehistory[i].name;
							if (i !== (namehistory.length - 1)) {
								allNames += ', ';
							}
						}
						playerHistory.addField(`${args[0]} has too many names, at ${namehistory.length} which is more than RichEmbeds can handle. So it has been truncated.`, `All of **${args[0]}'s** names are: ${allNames}`);
					}
					message.channel.send(playerHistory);
				});
			});
		} else {
			message.reply('You must only provide a username after the command.');
		}
	},
};
