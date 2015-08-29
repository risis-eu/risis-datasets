'use strict';
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config.js');
module.exports = {
    sendMail: function(type, from, to, subject, text, html){
        switch (type) {
            case 'userActivation':
                subject = config.emailTemplates.userActivation.subject;
                text = config.emailTemplates.userActivation.text;
                if(!from){
                    from = config.sender;
                }
                break;
            case 'userRegistration':
                subject = config.emailTemplates.userRegistration.subject;
                text = config.emailTemplates.userRegistration.text;
                if(!to){
                    to = config.sender;
                }
                break;
            case 'passwordReset':
                if(!from){
                    from = config.sender;
                }
                subject = subject;
                text = text;
                break;
            default:
                subject =subject;
                text = text;
        }
        html = text;
        var transporter = nodemailer.createTransport(smtpTransport(config.emailConfig));
        // send mail
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        }, function(error, info){
             if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    }
}
