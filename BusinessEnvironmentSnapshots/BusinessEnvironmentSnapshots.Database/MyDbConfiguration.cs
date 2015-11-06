using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database
{
    public class MyDbConfiguration : DbConfiguration
    {
        public MyDbConfiguration()
        {
            if (ConfigurationManager.AppSettings["addDbLogger"] == "true")
            {
                //SetDatabaseLogFormatter(
                //    (context, writeAction) => new DbLogFormatter(context, writeAction));
                DbInterception.Add(new EFLoggerForTesting());
            }
        }
    }
}
