# IPLookup system

The system when started will parse a CSV database containing all the IPs range assigned to regions, you can find an example in http://dev.maxmind.com/geoip/legacy/csv/ the sample used is based on the GeoIP City Edition.

For all the rows in the CSV file, the system will convert the long integers representing the IP range to the IP string, and split the string into four octets. Only the first three are used, because all the IPs range goes from 0.0.0.0 to 0.0.0.255.

All the IPs are stored in a json object, using a four level structure, the last level contains the country code where the given range belongs to.

The given structure can store all the IPs range available, taking in account the private IPs range, and at most will need around 16 769 179 bytes (16.769179MB) to store all the information.

To search you only need to access the object splitting the given IP address, and calling the nodes of the json object directly. In case the node doesn't exist in the given object you can consider the given IP is not in any given range and can't try to find the country.