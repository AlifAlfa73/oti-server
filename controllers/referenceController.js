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

    translate('Anak saya tiba-tiba menjadi pendiam', { to: 'en' }).then(trans => {
        console.log(trans.text); // OUTPUT: You are amazing!
        console.log('find');
        Reference.find({"text" : trans.text}, function (err, reference) {
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