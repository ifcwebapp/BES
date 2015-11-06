using System;
using System.Dynamic;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace BusinessEnvironmentSnapshots.UI.Controllers
{
    public class SpecsController : Controller
    {
        public ActionResult Index(String path)
        {
            if (String.IsNullOrWhiteSpace(path))
            {
                return View("All");
            }
            else
            {
                dynamic model = new ExpandoObject();
                model.Path = path;
                return View("One", model);
            }
        }
    }
}