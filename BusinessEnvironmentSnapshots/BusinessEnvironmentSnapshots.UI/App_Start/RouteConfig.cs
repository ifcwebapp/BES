using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace BusinessEnvironmentSnapshots.UI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Specs",
                url: "specs/{path}",
                defaults: new { controller = "Specs", action = "Index", path = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Labs",
                url: "labs/{view}",
                defaults: new { controller = "Labs", action = "Index" }
            );

            routes.MapRoute(
                name: "API's",
                url: "api/{action}",
                defaults: new { controller = "Api" }
            );

            routes.MapRoute(
                name: "Main",
                url: "",
                defaults: new { controller = "App", action = "Main" }
            );

            routes.MapRoute(
                name: "Chart",
                url: "country/{countryCode}/{chartId}",
                defaults: new { controller = "App", action = "Chart" }
            );

            routes.MapRoute(
                name: "Country",
                url: "country/{countryCode}",
                defaults: new { controller = "App", action = "Country", countryCode = (string)null }
            );

            routes.MapRoute(
                name: "Report",
                url: "report/{countryCode}",
                defaults: new { controller = "App", action = "Report" }
            );

        }
    }
}
