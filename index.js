var fs = require("fs");
var Handlebars = require("handlebars");

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");

  resume.work.sort(sortWork);
  resume.projects.sort(sortWork);

	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

function sortWork(a, b) {
  const parseDate = date => date ? new Date(date) : new Date('9999-12-31');
  const endDateA = parseDate(a.endDate);
  const endDateB = parseDate(b.endDate);
  const startDateA = new Date(a.startDate);
  const startDateB = new Date(b.startDate);

  if (endDateB - endDateA !== 0) {
    return endDateB - endDateA;
  }

  return startDateB - startDateA;
}

module.exports = {
	render: render
};

Handlebars.registerHelper('brand', function(str) {
  switch (str.toLowerCase()) {
    case 'blog':
      return 'fa fa-blog';
    case 'stackoverflow':
      return 'fab fa-stack-overflow';
    default:
      // Hope for the best...
      return `fab fa-${str.toLowerCase()}`;
  }
});

Handlebars.registerHelper('flag', function(country) {
  if (!country) {
    // No country, no flag
    return '';
  }

  // If the display supports it, a flag emoji appears when you take
  // a two-letter ISO country code and turn the letters into their
  // emoji equivalent
  const cc = country.toUpperCase();
  return Array
    .from(cc)
    .map((l) => String.fromCodePoint(l.toLowerCase().charCodeAt() + 127365))
    .join('');
});

Handlebars.registerHelper('date', function(dd) {
  const date = new Date(dd);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const mm = `00${month}`.slice(-2);

  return `${year} / ${mm}`;
});
