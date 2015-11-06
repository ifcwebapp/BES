using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BusinessEnvironmentSnapshots.Database;
using BusinessEnvironmentSnapshots.Database.ChartRepository;
using BusinessEnvironmentSnapshots.Service.Models;

namespace BusinessEnvironmentSnapshots.Service.Controllers
{
    public class CountriesController : BaseController
    {
        public IHttpActionResult GetCountries()
        {
            return this.WatchForErrors(
                () => new Repository().GetCountries(),
                "Unable to get all countries."
            );
        }
    }
}
