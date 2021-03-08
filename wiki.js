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
                    let title = res.data[1][0];
                    axios.get(this.apiURL, {
                        params: {
                            'action': 'query',
                            'format': 'json',
                            'titles': title,
                            'prop': 'extracts|info',
                            'inprop': 'url',
                            'exintro': true,
                            'explaintext': true
                        }
                    }).catch(err => {
                        reject('error when getting pages');
                    }).then(res => {
                        //console.log('page')
                        //console.log(res);
                        let page = res.data.query.pages[Object.keys(res.data.query.pages)[0]];
                        let url = res.data.query.pages[Object.keys(res.data.query.pages)[0]].fullurl
                        let lines = page.extract
                            .replace(/\. /g, '.\n')
                            .trim()
                            .split('\n')
                            .slice(
                                0,
                                page.extract
                                    .replace(/\. /g, '.\n')
                                    .trim()
                                    .split('\n')
                                    .indexOf('')
                            );
                        axios.get(this.apiURL, {
                            params: {
                                'action': 'query',
                                'format': 'json',
                                'prop': 'images',
                                'pageids': Object.keys(res.data.query.pages)[0]
                            }
                        }).catch(err => {
                            resolve([page, undefined, lines, url]);
                        }).then(imagearr => {
                            //console.log(imagearr);
                            let filename = imagearr.data.query.pages[Object.keys(imagearr.data.query.pages)[0]].images[0].title
                            //console.log(filename)
                            axios.get(this.apiURL, {
                                params: {
                                    'action': 'query',
                                    'format': 'json',
                                    'prop': 'imageinfo',
                                    'iiprop': 'url',
                                    'titles': filename
                                }
                            }).catch(err => {
                                resolve([page, undefined, lines, url]);
                            }).then(res => {
                                let image = res.data.query.pages['-1'].imageinfo[0].url;
                                resolve([page, image, lines, url]);
                            }).catch(err => {
                                resolve([page, undefined, lines, url]);
                            });
                        }).catch(err => {
                            resolve([page, undefined, lines, url]);
                        });
                    }).catch(err => {
                        reject('error when creating response')
                    })
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