using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database
{
    public class DbLogFormatter : DatabaseLogFormatter
    {
        public DbLogFormatter(DbContext context, Action<string> writeAction)
            : base(context, writeAction)
        {
        }

        public override void LogCommand<TResult>(
            DbCommand command, DbCommandInterceptionContext<TResult> interceptionContext)
        {
           
        }

        public override void LogParameter<TResult>(DbCommand command, DbCommandInterceptionContext<TResult> interceptionContext, DbParameter parameter)
        {
            //base.LogParameter(command, interceptionContext, parameter);
        }

        public override void ConnectionGetting(DbTransaction transaction, DbTransactionInterceptionContext<DbConnection> interceptionContext)
        {
            //base.ConnectionGetting(transaction, interceptionContext);
        }

        public override void Closing(DbConnection connection, DbConnectionInterceptionContext interceptionContext)
        {
            //base.Closing(connection, interceptionContext);
        }

        public override void Closed(DbConnection connection, DbConnectionInterceptionContext interceptionContext)
        {
            //base.Closed(connection, interceptionContext);
        }

        public override void LogResult<TResult>(
            DbCommand command, DbCommandInterceptionContext<TResult> interceptionContext)
        {
            //Write(string.Format(
            //   "Context '{0}' is executing command '{1}'{2}",
            //   Context.GetType().Name,
            //   command.CommandText.Replace(Environment.NewLine, ""),
            //   Environment.NewLine));
                 
        }

        public override void Opening(DbConnection connection, DbConnectionInterceptionContext interceptionContext)
        {
            //base.Opening(connection, interceptionContext);
        }

        public override void Opened(DbConnection connection, DbConnectionInterceptionContext interceptionContext)
        {
            //base.Opened(connection, interceptionContext);
        }
    }
}
