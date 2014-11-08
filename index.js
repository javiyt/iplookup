var http = require('http'),
    ipLookup = require('./lib/iplookup'),
    csvParser = require('./lib/csv_parser')
    ipReg = /\api\/v1\/ip\/((\d){1,3}\.(\d){1,3}\.(\d){1,3}\.(\d){1,3})$/,
    port = process.env.PORT || 5000;

var startServer = function(ips_list)
{
    var header_code = null,
        country = '';

    ipLookup.setIpsList(ips_list.ips);

    http.createServer(function (req, res) {
        var ip = req.url.match(ipReg);

        if(!ip)
        {
            header_code = 400;
            country = "Invalid IP";
        }
        else
        {
            var short_country = ipLookup.findCountry(ip[1]);

            if (null !== short_country)
            {
                header_code = 200;
                country = ips_list.countries[short_country];
            }
            else
            {
                header_code = 404;
                country = "IP Not Found";
            }
        }

        res.writeHead(header_code, {"Content-Type": "application/json"});
        res.end(JSON.stringify({"country": country}));

    }).listen( port );

    console.log('Server running at http://127.0.0.1:' + port + '/');
};

var parser = new csvParser('partial.csv');
parser.on('parsed', startServer);
parser.parse();