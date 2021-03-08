const wikisearch = require('./wiki');
const Discord = require('discord.js');

const wikipedia = new wikisearch();
const client = new Discord.Client()

client.on('ready', () => {
    console.log('logged in as ' + client.user.tag)
    client.user.setPresence({
        activity: {
            name: '--wiki',
            type: 'LISTENING',
            url: 'https://discord.com/oauth2/authorize?client_id=818573987881156618&scope=bot&permissions=52224'
        },
        afk: false,
        status: 'online'
    })
});

async function sendarticle(msg, args) {
    msg.channel.startTyping();
    wikipedia.search(args.slice(1).join(' ')).then(([page, image, lines, url]) => {
        emb = new Discord.MessageEmbed();
        //console.log('page:');
        //console.log(page);
        //console.log('imageurl:');
        //console.log(image);
        //console.log('lines:');
        //console.log(lines);
        emb.setColor('#ffffff')
            .setTitle(page.title)
            .setTimestamp()
            .setURL(url)
            .setDescription(lines.join('\n\n'))
            .setFooter('made by crinfarr#3251', 'https://cdn.discordapp.com/avatars/302211105151778826/b1c144918577ac5db00585235b83ec27.png');
        if (image !== undefined)
            emb.setThumbnail(image.toString());
        if (lines.join('\n\n').length >= 2048) {
            emb.setDescription(lines.join('\n\n').substring(0, 2043) + '[...]');
        }
        msg.channel.send(emb);
        msg.channel.stopTyping();
    }).catch(err => {
        msg.channel.send("❌ can't find a wiki!");
        msg.channel.stopTyping(true);
        console.error(err);
    });
}

client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith('--')) return;
    args = msg.content.split(' ');
    switch (args[0]) {
        case '--wiki':
            if (args.length < 2) {
                msg.channel.send('usage: --wiki [search terms]')
                console.log(`${msg.author.tag} got help at ${new Date()}`);
                return;
            }
            sendarticle(msg, args);
            console.log(`${msg.author.tag} called for an article on ${msg.content.slice(1).join(' ')} at ${new Date()}`);
    }
})

client.login('');
