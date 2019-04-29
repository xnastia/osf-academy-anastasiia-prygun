const http = require('http');
const currencyUrl = "http://data.fixer.io/api/latest?access_key=f79274d4794576a973e028157788fa22&symbols=USD,UAH,RUB&format=3"

module.exports = function(req, res, next){
  if (global.rates == null) {
      global.rates = {'USD': 1.0}
        http.get(currencyUrl, (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          });
          resp.on('end', () => {
            response = JSON.parse(data);
            if (response.success){
                usd_rate = response.rates['USD']
                var eur_rate = 1.0 / usd_rate
                global.rates['EUR'] = eur_rate
                delete response.rates['USD']
                for (key in response.rates){
                  global.rates[key] = response.rates[key] / usd_rate
                }
                next()
            }
          });
        })
    }
    else{
        next()
    }
};