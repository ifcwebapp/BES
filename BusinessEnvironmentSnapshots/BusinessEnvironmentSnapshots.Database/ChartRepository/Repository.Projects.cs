using System;
using System.Collections.Generic;
using System.Linq;
using BusinessEnvironmentSnapshots.Database.Model;

namespace BusinessEnvironmentSnapshots.Database.ChartRepository
{
    public partial class Repository
    {
        public List<Project> GetProjects(string countryCode)
        {
            return LogTime(() =>
            {
                var db = new DatabaseRepository();
                var result = db.GetBankProjects(countryCode).Select(d => new Project
                {
                    Amount = d.Amount,
                    ApprovalDate = d.ApprovalDate,
                    CountryCode = d.CountryCode,
                    ProjectId = d.ProjectId,
                    ProjectLink = d.ProjectLink,
                    ProjectName = d.ProjectName,
                    ProjectType = d.ProjectType,
                    ProjectStatus = d.ProjectStatus
                }).ToList();

                return result;
            }, "project request for country {0}", countryCode);
        }
    }
}
