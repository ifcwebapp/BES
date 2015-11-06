using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using BusinessEnvironmentSnapshots.Database;
using BusinessEnvironmentSnapshots.Database.ChartRepository;
using BusinessEnvironmentSnapshots.Service.Models;

namespace BusinessEnvironmentSnapshots.Service.Controllers
{
    public class StatisticsController : BaseController
    {
        public IHttpActionResult GetStatistics(string countryCode)
        {
            return this.WatchForErrors<Object>(
                delegate
                {
                    if (String.IsNullOrWhiteSpace(countryCode)) throw new ApplicationException("Country code is empty.");
                    try
                    {
                        return new { some = new Repository().GetKeyStatistics(countryCode) };
                    }
                    catch (Exception exception)
                    {
                        return new
                        {
                            none = toExceptionMessage(
                                exception,
                                new StringBuilder("There is no data for the key statistics of the \"" + countryCode + "\" country.")
                            )
                        };
                    }
                },
                "Unable to get key statistics for the \"" + countryCode + "\" country."
            );
        }
    }
}
