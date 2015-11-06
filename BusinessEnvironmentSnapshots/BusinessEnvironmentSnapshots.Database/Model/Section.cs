using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Section
    {
        public string Name { get; set; }
        
        public string Description { get; set; }

        public List<string> ChartIds { get; set; }

        public int Id { get; set; }

        public int OrderId { get; set; }

        public string SectionType { get; set; }

        public object Data { get; set; }
    }
}
