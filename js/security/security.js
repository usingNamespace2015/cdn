/* Token-based authentication for ASP .NET MVC REST web services.
   Copyright (c) 2015 Kory Becker
   http://primaryobjects.com/kory-becker
   License MIT
*/
var SecurityManager = {
    salt: localStorage['SecurityManager.salt'],
    username: localStorage['SecurityManager.username'],
    key: localStorage['SecurityManager.key'],
    ip: null,

    generate: function (username, password) {
		// Set the username.
		SecurityManager.username = SecurityManager.username || username;
		
        // Set the key to a hash of the user's password + salt + username.
		var hashedPassword;
		if(!SecurityManager.key)
		{
			hashedPassword = CryptoJS.enc.Base64.stringify(CryptoJS.PBKDF2(password, SecurityManager.salt,{hasher:CryptoJS.algo.SHA256, iterations: SecurityManager.iterations, keySize: 8}));
		}
		
        SecurityManager.key = SecurityManager.key || CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([hashedPassword, SecurityManager.salt, SecurityManager.username].join(':'), SecurityManager.salt));

        // Persist key pieces.
        if (SecurityManager.username) {
			try{
				localStorage['SecurityManager.username'] = SecurityManager.username;
				localStorage['SecurityManager.key'] = SecurityManager.key;
				localStorage['SecurityManager.salt'] = SecurityManager.salt;
			}catch(e){
				Storage.prototype._setItem = Storage.prototype.setItem;
				Storage.prototype._setItem = function () {};
				alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
			}
        }

        // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
        var ticks = ((new Date().getTime() * 10000) + 621355968000000000);

        // Construct the hash body by concatenating the username, ip, and userAgent.
		//.replace(/ \.NET.+;/, '').replace("SLCC2; " , '') are for IE 11 compatibility since it sends different user Agents if you are on a subdomain
        var message = [SecurityManager.username, SecurityManager.ip, navigator.userAgent.replace(/ \.NET.+;/, '').replace("SLCC2; " , ''), ticks].join(':');

        // Hash the body, using the key.
        var hash = CryptoJS.HmacSHA256(message, SecurityManager.key);
		
        // Base64-encode the hash to get the resulting token.
        var token = CryptoJS.enc.Base64.stringify(hash);

        // Include the username and timestamp on the end of the token, so the server can validate.
        var tokenId = [SecurityManager.username, ticks].join(':');

        // Base64-encode the final resulting token.
        var tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(':'));

        return CryptoJS.enc.Base64.stringify(tokenStr);
    },

    logout: function () {
        SecurityManager.ip = null;
		
		localStorage.removeItem('SecurityManager.salt');
        SecurityManager.salt = null;
		
        localStorage.removeItem('SecurityManager.username');
        SecurityManager.username = null;
		
        localStorage.removeItem('SecurityManager.key');
        SecurityManager.key = null;
    }
};