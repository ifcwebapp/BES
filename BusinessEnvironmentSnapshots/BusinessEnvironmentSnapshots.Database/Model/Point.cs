using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Point
    {
        public decimal? Value { get; set; }
        public string Suffix { get; set; }
        public string ValueString { get; set; }
    }
}
