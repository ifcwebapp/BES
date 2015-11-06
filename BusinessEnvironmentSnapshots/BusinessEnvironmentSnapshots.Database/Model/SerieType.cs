using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database.Model
{
    public enum SeriesType
    {
        Line = 0, Polar = 1, Column = 2, Bar = 3, Pie = 4, StackedBar = 5
    }
}
