using BusinessEnvironmentSnapshots.UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BusinessEnvironmentSnapshots.UI.Controllers
{
    public class LabsController : Controller
    {
        public ActionResult Index(String view)
        {
            return this.View(view);
        }
    }
}