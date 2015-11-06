using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;

namespace BusinessEnvironmentSnapshots.Database
{
    public class EFLoggerForTesting : IDbCommandInterceptor
    {
        static readonly ConcurrentDictionary<DbCommand, DateTime> m_StartTime = new ConcurrentDictionary<DbCommand, DateTime>();
        static ILog log = LogManager.GetLogger("default");

        public void ReaderExecuted(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {
            Log(command, interceptionContext);
        }

        public void NonQueryExecuted(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
            Log(command, interceptionContext);
        }

        public void ScalarExecuted(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            Log(command, interceptionContext);
        }

        private static void Log<T>(DbCommand command, DbCommandInterceptionContext<T> interceptionContext)
        {
            DateTime startTime;
            TimeSpan duration;

            m_StartTime.TryRemove(command, out startTime);
            if (startTime != default(DateTime))
            {
                duration = DateTime.Now - startTime;
            }
            else
                duration = TimeSpan.Zero;

            var requestId = -1;
            string message;

            var parameters = new StringBuilder();
            foreach (DbParameter param in command.Parameters)
            {
                if (param.Value is DataTable)
                {
                    var dt = param.Value as DataTable;
                    parameters.AppendLine(param.ParameterName + " DataTable = ");
                    foreach (DataRow row in dt.Rows)
                    {
                        parameters.AppendLine(row[0].ToString());
                    }
                }
                else
                {
                    parameters.AppendLine(param.ParameterName + " " + param.DbType + " = " + param.Value);
                }
            }

            if (interceptionContext.Exception == null)
            {
                message = string.Format("\r\nDatabase call took {0} sec. RequestId {1} \r\nCommand:\r\n{2}", duration.TotalSeconds.ToString("N3"), requestId, parameters.ToString() + command.CommandText);
            }
            else
            {
                message = string.Format("\r\nEF Database call failed after {0} sec. RequestId {1} \r\nCommand:\r\n{2}\r\nError:{3} ", duration.TotalSeconds.ToString("N3"), requestId, parameters.ToString() + command.CommandText, interceptionContext.Exception);
            }


            log.Info(message + "\r\n---------------------------------------------\r\n");
        }


        public void NonQueryExecuting(DbCommand command, DbCommandInterceptionContext<int> interceptionContext)
        {
            OnStart(command);
        }

        public void ReaderExecuting(DbCommand command, DbCommandInterceptionContext<DbDataReader> interceptionContext)
        {
            OnStart(command);
        }

        public void ScalarExecuting(DbCommand command, DbCommandInterceptionContext<object> interceptionContext)
        {
            OnStart(command);
        }
        private static void OnStart(DbCommand command)
        {
            m_StartTime.TryAdd(command, DateTime.Now);
        }
    }
}
