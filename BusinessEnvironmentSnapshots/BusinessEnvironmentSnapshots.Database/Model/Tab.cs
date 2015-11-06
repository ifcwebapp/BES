using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Tab
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public List<Section> Sections { get; set; }
    }
}
