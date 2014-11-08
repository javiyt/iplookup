function IPLookup()
{
    this.ips_list = {};
};

IPLookup.prototype.setIpsList = function(ips_list) {
    this.ips_list = ips_list;
};

IPLookup.prototype.long2ip = function(ip_long) {
    return 1 << -1 <= ip_long && ip_long < 4294967296 && [ip_long >>> 24, 255 & ip_long >>> 16, 255 & ip_long >>> 8, 255 & ip_long].join('.');
};

IPLookup.prototype.findCountry = function(ip_address) {
    var parsed_ip = ip_address.split('.');

    if (
        (parsed_ip[0] in this.ips_list)
        && (parsed_ip[1] in this.ips_list[parsed_ip[0]])
        && (parsed_ip[2] in this.ips_list[parsed_ip[0]][parsed_ip[1]])
    )
    {
        return this.ips_list[parsed_ip[0]][parsed_ip[1]][parsed_ip[2]];
    }

    return null;
};

module.exports = new IPLookup();