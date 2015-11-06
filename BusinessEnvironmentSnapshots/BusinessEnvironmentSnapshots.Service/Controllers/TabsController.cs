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
    public class TabsController : BaseController
    {
        public IHttpActionResult GetTabs(string countryCode)
        {
            return this.WatchForErrors(
                () => new Repository().GetTabs(countryCode),
                "Unable to get tabs."
            );
        }
    }
}
