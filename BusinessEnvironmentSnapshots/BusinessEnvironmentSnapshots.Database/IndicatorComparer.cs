using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database
{
    class IndicatorComparer : IComparer<string>
    {
        private Dictionary<string, int> indicatorNames;

        public IndicatorComparer(IEnumerable<string> indicators)
        {
            this.indicatorNames = indicators.Select((ind, i) => new KeyValuePair<string, int>(ind, i)).ToDictionary(k => k.Key, k => k.Value);
        }

        public int Compare(string x, string y)
        {
            return indicatorNames[x.Trim()].CompareTo(indicatorNames[y.Trim()]);
        }
    }
}
