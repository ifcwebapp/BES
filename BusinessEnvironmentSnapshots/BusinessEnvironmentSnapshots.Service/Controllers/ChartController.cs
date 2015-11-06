using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using BusinessEnvironmentSnapshots.Database;
using BusinessEnvironmentSnapshots.Database.ChartRepository;
using BusinessEnvironmentSnapshots.Database.Model;
using BusinessEnvironmentSnapshots.Service.Models;

namespace BusinessEnvironmentSnapshots.Service.Controllers
{
    public class ChartController : BaseController
    {
        [Route("api/chart-ids")]
        public IHttpActionResult GetChartIds()
        {
            return this.WatchForErrors(
                delegate
                {
                    return new Repository().GetAllChartIds();
                },
                "Unable to get all chart ID's."
            );
        }

        public IHttpActionResult GetChartById(string id, string countryCode, string years = null)
        {
            return this.WatchForErrors(
                delegate
                {
                    if (String.IsNullOrWhiteSpace(id)) throw new ArgumentException("Chart ID is empty.");
                    if (String.IsNullOrWhiteSpace(countryCode)) throw new ArgumentException("Country code is empty.");

                    return new Repository().GetChart(id, countryCode, years);
                },
                "Unable to get a \"" + id + "\" chart for the \"" + countryCode + "\" country."
            );
        }

        
    }
}
