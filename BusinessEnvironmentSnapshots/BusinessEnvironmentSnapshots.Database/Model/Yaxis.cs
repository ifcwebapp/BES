using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public class Yaxis : Axis
    {
        public double Start { get; set; }
        public double End { get; set; }
        public string ValueSuffix { get; set; }
    }
}
