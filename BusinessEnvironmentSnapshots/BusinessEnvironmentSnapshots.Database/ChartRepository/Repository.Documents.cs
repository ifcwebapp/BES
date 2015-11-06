using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        public List<Document> GetDocuments(string countryCode)
        {
            return LogTime(() =>
            {
                var db = new DatabaseRepository();
                var data = db.GetDocuments(countryCode).OrderBy(d => d.DocType).ThenBy(d => d.DocName);

                return
                    data.Select(d => new Document {Name = d.DocName, Link = d.DocLink, Type = d.DocTypeDescription})
                        .ToList();
            }, "documents request for country {0}", countryCode);
        }
    }
}
