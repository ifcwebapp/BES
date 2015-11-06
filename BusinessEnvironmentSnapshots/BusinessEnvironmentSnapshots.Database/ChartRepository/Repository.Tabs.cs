using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        public List<Tab> GetTabs(string countryCode)
        {
            return LogTime(() =>
            {
                var db = new DatabaseRepository();
                var data = db.GetAllTabs();
                var result =
                    data.GroupBy(t => new Tuple<string, string>(t.TabCode, t.TabName))
                        .Select(
                            r =>
                                new Tab
                                {
                                    Code = r.Key.Item1,
                                    Name = r.Key.Item2,
                                    Sections =
                                        r.GroupBy(g => g.SectionName)
                                            .Select(
                                                t =>
                                                    new Section
                                                    {
                                                        OrderId = t.First().SectionOrderId.Value,
                                                        SectionType = t.First().SectionType,
                                                        Id = t.First().SectionId,
                                                        Name = t.Key,
                                                        Description = t.First().SectionDescription,
                                                        ChartIds =
                                                            t.Where(c => c.ChartId != null)
                                                                .OrderBy(c => c.ChartOrderId)
                                                                .Select(c => c.ChartId)
                                                                .ToList()
                                                    })
                                            .ToList()
                                }).ToList();
                foreach (var t in result)
                {
                    t.Sections = t.Sections.OrderBy(s => s.OrderId).ToList();
                }

                var projects = GetProjects(countryCode);
                var documents = GetDocuments(countryCode);
                var other = GetOtherResources(countryCode);
                var keyStats = GetKeyStatistics(countryCode);

                var sections = result.SelectMany(t => t.Sections);
                foreach (var section in sections)
                {
                    switch (section.SectionType)
                    {
                        case "IFC":
                        case "Bank":
                        case "Knowledge Product":
                            section.Data = projects.Where(p => p.ProjectType == section.SectionType).ToList();
                            break;
                        case "Document":
                            section.Data = documents;
                            break;
                        case "Other":
                            section.Data = other;
                            break;
                        case "Key Statistics":
                            section.Data = keyStats;
                            break;
                    }
                }
                return result;
            }, "tab info request for country {0}", countryCode);
        }
    }
}
