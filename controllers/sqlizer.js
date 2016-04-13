exports.install = function() {
	F.route('/sqlizer', viewSqlizer);
	F.route('/api/sqlizer/proses', funcProses, ['post']);
};

function viewSqlizer() {
	var self = this;
	self.view('sqlizer');
}

function funcProses() {
	var res = this;
	var xml = new Object();
	var async = new Utils.Async();
	var sintaks = res.body;
	async.await(function(next) {
		var con = F.suryaMYSQL.createConnection({
			host		: sintaks.host,
			user		: sintaks.user,
			password	: sintaks.password,
			database	: sintaks.database
		});
		con.query(sintaks.sintaks, function (error, data) {
			if (error) {
				xml.sqlizer = error;
				dt = error;
			} else {
				xml.sqlizer = data;
				dt = data
			}
			next();
		});
	});
	async.run(function() {
		var dtXml = JSON.stringify(xml);
		var fileXML = F.suryaXML('suryaxml', dtXml);
		res.json({dt: dt, xml: fileXML});
	});
}
