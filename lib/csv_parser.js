var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream'),
    ipLookup = require('./iplookup'),
    EventEmitter = require('events').EventEmitter,
    util = require('util');

function csvParser(open_file)
{
    this.outstream = new stream();
    this.instream = fs.createReadStream(open_file);

    this.outstream.readable = true;
    this.outstream.writable = true;

    this.rl = readline.createInterface({
        input: this.instream,
        output: this.outstream,
        terminal: false
    });

    this.ips_list = {
        countries: {},
        ips: {}
    };
};

util.inherits(csvParser, EventEmitter);

csvParser.prototype.parse = function() {
    var self = this;

    this.rl.on('line', function(line) {
        var line_data = line.split(','),
            min_ip = ipLookup.long2ip(parseInt(line_data[0].replace(/"/g, ''))).split('.'),
            max_ip =  ipLookup.long2ip(parseInt(line_data[1].replace(/"/g, ''))).split('.'),
            short_country = line_data[2].replace(/"/g, ''),
            country = line_data[3].replace(/"/g, '');

        if (!(short_country in self.ips_list.countries))
        {
            self.ips_list.countries[short_country] = country;
        }

        for (var first_octet = min_ip[0]; first_octet <= max_ip[0]; first_octet++) {
            if (!(first_octet in self.ips_list.ips)) {
                self.ips_list.ips[first_octet] = {};
            }

            for (var second_octet = min_ip[1]; second_octet <= max_ip[1]; second_octet++) {
                if (!(second_octet in self.ips_list.ips[first_octet])) {
                    self.ips_list.ips[first_octet][second_octet] = {};
                }

                for (var third_octet = min_ip[2]; third_octet <= max_ip[2]; third_octet++) {
                    if (!(third_octet in self.ips_list.ips[first_octet][second_octet])) {
                        self.ips_list.ips[first_octet][second_octet][third_octet] = short_country;
                    }
                }

            }
        }
    }).on('close', function()
    {
        self.emit('parsed', self.ips_list);
    });
};

module.exports = csvParser;