const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const createHTML = require('create-html');
const pdf = require('html-pdf');
const html = fs.readFileSync('./uploads/test/pdf.html', 'utf8');

const bodyParser = require('body-parser').json();
const decode = require('unescape');

const options = {
    format: 'A4',
    head: '<style>.pdf-container{padding-bottom:50px;padding-top:50px}.logo{margin-top:80px;margin-left:60px;margin-right:30px;z-index:5;display:block}img{max-width:100%;height:auto}.section-top{page-break-after:always}.section-top .offer-info-container{padding:0 60px;margin-bottom:-40px;text-align:left}.section-top .offer-info-container .offer-info{float:left;width:2.5in;height:1.1in}.section-top .offer-info-container .offer-info h4{margin:0;font-size:12px}.section-top .offer-info-container .offer-info1{margin-left:60px}.section-top .section-top-bottom{font-size:10px;padding:0 60px}.page-wrapper{page-break-after:always}.page-wrapper p{margin-top:0;margin-bottom:15px;page-break-after:auto;font-size:11px}.page-wrapper h2{margin-bottom:30px}.page-wrapper h4{font-size:14px}.page-wrapper h4.no-borders{border:none}.page-wrapper li{font-size:11px}.page-wrapper td{font-size:11px}.page-wrapper td h4{font-size:14px}.content-wrapper{padding:0 60px}.content-wrapper ul{padding-left:0;margin-left:0}.content-wrapper p ul{padding-left:0}.content-wrapper h4{border-top:1px solid #D5E5A4;border-bottom:1px solid #D5E5A4;padding-top:10px;padding-bottom:10px;padding-left:10px}.content-wrapper .first-td h4,.content-wrapper .second-td h4,.content-wrapper .third-td h4,.content-wrapper .total h4{padding:10px;border:none;margin:0}.content-wrapper .bemerkungen{page-break-before:auto}.content-wrapper .bemerkungen h4{border:none;margin:0}.content-wrapper .bemerkungen ul{padding:0;margin:0 0 10px}.content-wrapper .bemerkungen ul li{font-size:9px}.content-wrapper .bemerkungen p{font-size:9px}.content-wrapper .manager-table h4{border:none;margin:0}.line1{display:block;margin:0;padding:0;z-index:2;margin-top:-90px}.line2{display:block;padding:0;z-index:2;margin-top:-120px;margin-bottom:180px}.line3{display:block;margin:0;padding:0;z-index:2}.pdf-container{max-width:980px}li{margin-bottom:5px;color:#5B5A5A}.total-table{margin:10px 0 40px}.auftrag{border-bottom:1px solid #D5E5A4}.manager-table{margin:40px 0}.total{border-top:1px solid #D5E5A4;border-bottom:1px solid #D5E5A4;padding-top:10px;padding-bottom:10px}.total h4{text-align:left;border:none}.total p{text-align:right}.manager-date{text-align:right}.manager{border-top:1px solid #D5E5A4;border-bottom:1px solid #D5E5A4;padding-top:10px;padding-bottom:10px;text-align:left}.modules-header{border-top:1px solid #D5E5A4;border-bottom:1px solid #D5E5A4;padding-top:10px;padding-bottom:10px;padding-left:10px}.modules-header .second-td,.modules-header .third-td{padding-top:10px}.modules-header .second-td h4,.modules-header .third-td h4{font-size:14px;font-weight:400;border:none}table{width:100%}table,td{border:none}td{padding-right:20px;padding-top:0;vertical-align:top}p{margin-top:0;margin-bottom:20px;font-size:11px}ul{font-size:11px}.group-info ul{position:relative;page-break-after:auto}.group-info th{width:50%;text-align:left}.group-info th td{font-size:11px}.group-info th td h4{font-size:14px}.group-info h3{page-break-before:auto}.offer-info p{margin-top:0;margin-bottom:0;font-size:11px}.logo{margin-top:80px}.modules-main td{padding-right:auto;padding-top:auto;vertical-align:middle}.modules-main td .img-shape{margin-left:40px}.first-td{width:5in;min-width:5in;text-align:left;overflow:hidden}.first-td h4,.first-td p,.first-td ul{width:5in}.first-td h4{border:none}.first-td p,.first-td ul{font-weight:400;color:#5B5A5A}.first-td ul{width:5in;padding:0;margin-bottom:0}.first-td ul li{width:5in}.second-td{width:1in;text-align:center;overflow:hidden}.second-td h4{font-size:12px}.third-td{width:1in;text-align:center;overflow:hidden}.third-td h4{font-size:12px}h3{border-top:1px solid #D5E5A4;border-bottom:1px solid #D5E5A4;padding-top:10px;padding-bottom:10px;padding-left:10px}p{color:#5B5A5A}h1{text-align:left;font-size:34px;font-weight:700;margin-right:260px}h2{text-align:left;font-size:26px;font-weight:700;margin-right:200px;margin-top:0}ul{padding:10px 0}h1{text-align:left;font-size:34px;font-weight:700;margin-right:260px}h2{text-align:left;font-size:26px;font-weight:700;margin-right:200px;margin-bottom:0}.section-title{margin-top:150px;margin-bottom:180px}.section-title h1{margin-bottom:0;margin-top:0;padding:0 60px}.section-title h2{font-size:26px;padding:0 60px;margin:0}</style>'
};


router.post('/', bodyParser, function (req, res, next) {
    // const html = createHTML({
    //     title: 'PDF',
    //     css: 'example.css',
    //     body: decode(req.body.x),
    // });
    //
    // setTimeout(function () {
    //     fs.writeFile('./uploads/test/pdf.html', html, function (err) {
    //         if (err) console.log(err);
    //
    //
    //     });
    // }, 2000);

    pdf.create(html, options).toFile('./uploads/test/test9.pdf', function (err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/test.pdf' }
    });

    res.status(200).json({
        message: 'Successfully get filest'
    });
});

module.exports = router;