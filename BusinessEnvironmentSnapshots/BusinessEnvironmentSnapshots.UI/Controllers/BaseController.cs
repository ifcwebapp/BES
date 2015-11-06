using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using log4net;

namespace BusinessEnvironmentSnapshots.UI.Controllers
{
    public class BaseController : Controller
    {
        //private readonly bool logExecutionTimes;
        private readonly ILog log;
        public BaseController()
        {
            this.log = LogManager.GetLogger("default");
            //bool logTimes;
            //this.logExecutionTimes = Boolean.TryParse(ConfigurationManager.AppSettings["doLogging"], out logTimes) && logTimes;

        }

        protected HttpClient GetClient()
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(ConfigurationManager.AppSettings["serviceUrl"]);
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/html"));
            return client;
        }

        
        protected async Task<string> GetData(string request)
        {
            using (var client = GetClient())
            {
                var sw = Stopwatch.StartNew();
                HttpResponseMessage response = await client.GetAsync(request);
                var result = await response.Content.ReadAsStringAsync();
                sw.Stop();
                if (ConfigurationManager.AppSettings["addDbLogger"] == "true")
                {
                    log.InfoFormat("request {0} took {1}", request, sw.Elapsed);
                }
                Response.ContentType = "application/json";
                return result;

            }
        }
    }
}