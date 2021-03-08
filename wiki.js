const { default: axios } = require("axios");

class wikisearch {
    /**
     * @description Creates a new Wiki search engine
     * @param {String} baseurl the base url of the wiki site, defaults to Wikipedia
     */
    constructor(baseurl = 'www.wikipedia.org') {
        this.apiURL = `http://${baseurl}/w/api.php`;
        /**
         * @description searches for a wikipedia page
         * @returns a promise for a wiki object
         * @param {String} query 
         */
        this.search = (query) => {
            return new Promise((resolve, reject) => {
                axios.get(this.apiURL, {
                    params: {
                        'action': 'opensearch',
                        'search': query,
                        'limit': 3
                    }
                }).then(res => {
                    //console.log(res);
                    let title = res.data[1][0];
                    axios.get(this.apiURL, {
                        params: {
                            'action': 'query',
                            'format': 'json',
                            'titles': title,
                            'prop': 'extracts',
                            'exintro': true,
                            'explaintext': true
                        }
                    }).then(res => {
                        //console.log(res);
                        let page = res.data.query.pages[Object.keys(res.data.query.pages)[0]]
                        /*axios.get(this.apiURL, {
                            params: {
                                'action': 'query',
                                'format': 'json',
                                'prop': 'images',
                                'pageids': Object.keys(res.data.query.pages)[0]
                            }
                        }).then(image => {
                            let filename = image.data.query.pages[Object.keys(image.data.query.pages)[0]].images[0].title
                            console.log(filename)
                            axios.get(this.apiURL, {
                                params: {
                                    'action': 'query',
                                    'format': 'json',
                                    'prop': 'imageinfo',
                                    'iiprop': 'url',
                                    'titles': filename
                                }
                            }).then(res => {
                                console.log(res.data.query.pages['-1'].imageinfo[0].url);
                            }) */
                        //resolve(page, image);
                        resolve(page)
                    });
                    /*resolve({
                        title: page.title,
                        text: page.text,
                        text_S: page.text.replace(/\./g, '\n.').split('\n')
                    })*/
                })
            })
        }
    }
}


//var wiki = new wikisearch()
//wiki.search('hello world').then(res => {
//    console.log(res)
//})

module.exports = wikisearch