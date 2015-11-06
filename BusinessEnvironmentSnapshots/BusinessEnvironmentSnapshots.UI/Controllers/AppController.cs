using BusinessEnvironmentSnapshots.UI.Models;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BusinessEnvironmentSnapshots.UI.Controllers
{
    public class AppController : BaseController
    {
        public ActionResult Main()
        {
            using (var client = this.GetClient())
            {
                var data = client.GetAsync("api/countries");
                dynamic countries = new ExpandoObject();
                countries.Countries = data.Result.Content.ReadAsStringAsync().Result;
                return this.View(countries);
            }
        }
        public ActionResult Country(String countryCode)
        {
            return this.View(new RootCountry { CountryCode = countryCode });
        }
        public ActionResult Chart(String countryCode, String chartId)
        {
            return this.View(new RootChart { ChartId = chartId, CountryCode = countryCode });
        }
        public ActionResult Report(String countryCode) {
            return this.View(new RootReport { CountryCode = countryCode });
        }
    }
}