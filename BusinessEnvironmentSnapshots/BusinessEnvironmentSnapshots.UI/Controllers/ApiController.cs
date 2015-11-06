using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BusinessEnvironmentSnapshots.UI.Controllers
{
    public class ApiController : BaseController
    {

        // GET: Chart
        public async Task<string> Chart(string id, string countryCode, string years)
        {
            return
                await
                    GetData(String.Format("api/chart?id={0}&countryCode={1}", id, countryCode) +
                            (String.IsNullOrEmpty(years) ? String.Empty : String.Format("&years={0}", years)));
        }

        public async Task<string> Tabs(string countryCode)
        {
            return await GetData(String.Format("api/tabs?countryCode={0}", countryCode));
        }

        public async Task<string> Countries()
        {
            return await GetData("api/countries");
        }

        public async Task<string> Projects(string countryCode)
        {
            return await GetData(String.Format("api/projects?countryCode={0}", countryCode));
        }

        public async Task<string> Documents(string countryCode)
        {
            return await GetData(String.Format("api/documents?countryCode={0}", countryCode));
        }

        public async Task<string> OtherResources(string countryCode)
        {
            return await GetData(String.Format("api/otherresources?countryCode={0}", countryCode));
        }

        public async Task<string> Statistics(string countryCode)
        {
            return await GetData(String.Format("api/statistics?countryCode={0}", countryCode));
        }

        public async Task<String> ChartIds()
        {
            return await GetData("api/chart-ids");
        }
    }
}