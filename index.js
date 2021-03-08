const wikisearch = require('./wiki');
const Discord = require('discord.js');

const wikipedia = new wikisearch();
const client = new Discord.Client()

function search(query) {
    wikipedia.search(query).then((wikipage, image) => {
        lines = wikipage.extract
            .replace(/\./g, '.\n')
            .trim()
            .split('\n')
            .slice(
                0,
                wikipage.extract
                    .replace(/\./g, '.\n')
                    .trim()
                    .split('\n')
                    .indexOf('')
            );
        lines.forEach(element => {
            element.trim();
        });
        console.log(wikipage, image)
        /* return {
            title: wikipage.title,
            body: lines
        } */
    });
}

client.on('ready', () => {
    console.log('logged in as ' + client.user.tag)
});

client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith('--')) return;
    args = msg.content.split(' ')
    console.log(args)
    switch (args[0]) {
        case wiki:
            msg.channel.startTyping()
            search(args[1]).then((wiki, image) => {
                emb = new Discord.MessageEmbed()
            })
    }
})

client.login();