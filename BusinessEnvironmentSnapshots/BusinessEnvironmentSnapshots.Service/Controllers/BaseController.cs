using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Http;

namespace BusinessEnvironmentSnapshots.Service.Controllers
{
    public class BaseController : ApiController
    {
        protected IHttpActionResult WatchForErrors<Data>(Func<Data> pop, String failure)
        {
            try
            {
                return Ok(new { data = pop() });
            }
            catch (Exception exception)
            {
                return Ok(new { problem = toExceptionMessage(exception, new StringBuilder(failure)) });
            }
        }

        protected static String toExceptionMessage(Exception exception, StringBuilder builder)
        {
            while (exception != null)
            {
                if (builder.Length > 0)
                {
                    builder.Append(" ");
                }
                builder.Append(exception.Message);
                exception = exception.InnerException;
            }
            return builder.ToString();
        }
    }
}