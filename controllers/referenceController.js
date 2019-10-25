const Reference = require('../models/reference');
const request = require('request');
const cheerio = require('cheerio');
const translate = require('@vitalets/google-translate-api');
const puppeteer = require('puppeteer');



//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.reference_create = function (req, res) {
    console.log(req.body);
    let reference = new Reference(
        {
            text: req.body.text,
            link: req.body.link
        }
    );  

    reference.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Reference Created successfully');
    });
};

exports.reference_detail = function (req, res) {
    console.log(req.body.text);

    translate(req.body.text, { to: 'en' }).then(trans => {
        console.log(trans.text); // OUTPUT: You are amazing!
        console.log('find');
        Reference.find({"text" : trans.text}, function (rerr, reference) {
            if (err) {
                console.log(err); 
                res.send('Error fetching!');
            } else {
                if (Object.keys(reference).length > 0){
                    res.send(reference);
                } else {
                    var query = encodeURI(trans.text);
                    var url = 'https://raisingchildren.net.au/search?query=' + query;
                    puppeteer
                    .launch()
                    .then(browser => browser.newPage())
                    .then(page => {
                        return page.goto(url).then(function() {
                        return page.content();
                        });
                    })
                    .then(html => {
                        const $ = cheerio.load(html);
                        let link = $(".search__result-link").attr("href");
                        console.log(link);
                        reply_message = encodeURI("Permasalahan tersebut dapat diakses pada artikel berikut " + link);
                        request('https://api.telegram.org/bot1056317114:AAGsRcsenzMPzFTppP2R3hhtwbbaeE_oF5c/sendMessage?chat_id=' + req.body.sender_id +'&text=' + reply_message, { json: true }, (err, res, body) => {
                            if (err) { 
                                return console.log(err); 
                            } else {
                                let reference = new Reference(
                                    {
                                        text: trans.text,
                                        link: link
                                    }
                                );      
                            
                                reference.save(function (err) {
                                    if (err) {
                                        return next(err);
                                    }
                                    res.send('Scrapped successfully');
                                });
                            }
                        });
                    })
                    .catch(console.error);
                    // request('https://raisingchildren.net.au/search?query=how%20to%20stop%20siblings%20fighting%20teen%20years', { json: true }, (err, res, body) => {
                    //     if (err) { 
                    //         return console.log(err); 
                    //     } else {
                    //         // console.log(body);
                    //         const $ = cheerio.load(body);
                    //         let link = $(".search__result-link").attr("href");
                    //         console.log(link);
                    //     }
                    // });
                }
            }
        });
    }).catch(err => {
        console.error(err);
    });
}


exports.reference_detail_nodb = function (req, res) {
    console.log(req.body.text);

    translate(req.body.text, { to: 'en' }).then(trans => {
        console.log(trans.text); // OUTPUT: You are amazing!
        console.log('find');
        var query = encodeURI(trans.text);
        var url = 'https://raisingchildren.net.au/search?query=' + query;
        console.log(url);


        puppeteer
        .launch({
            'args' : [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ]
          })
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url).then(function() {
            return page.content();
            });
        })
        .then(html => {
            const $ = cheerio.load(html);
            console.log(html);
            let link = $(".search__result-link").attr("href");
            console.log(link);
            if (link != undefined)
                reply_message = encodeURI("Permasalahan tersebut dapat diakses pada artikel berikut " + link);
            else
                reply_message =encodeURI("Permasalahan tersebut dapat diakses pada website berikut https://raisingchildren.net.au/");

                request('https://api.telegram.org/bot1056317114:AAGsRcsenzMPzFTppP2R3hhtwbbaeE_oF5c/sendMessage?chat_id=' + req.body.sender_id +'&text=' + reply_message, { json: true }, (err, result, body) => {
                if (err) { 
                    return console.log(err); 
                } else {
                    res.send('Scrapped successfully');
                }
            });
        })
        .catch(console.error);
                    // request('https://raisingchildren.net.au/search?query=how%20to%20stop%20siblings%20fighting%20teen%20years', { json: true }, (err, res, body) => {
                    //     if (err) { 
                    //         return console.log(err); 
                    //     } else {
                    //         // console.log(body);
                    //         const $ = cheerio.load(body);
                    //         let link = $(".search__result-link").attr("href");
                    //         console.log(link);
                    //     }
                    // });
    }).catch(err => {
        console.error(err);
    });
}