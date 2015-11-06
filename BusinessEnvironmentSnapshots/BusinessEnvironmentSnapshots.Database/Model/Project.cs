using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Project
    {
        public string CountryCode { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public decimal? Amount { get; set; }
        public string ProjectType { get; set; }
        public string ProjectLink { get; set; }
        public string ProjectStatus { get; set; }
    }
}
