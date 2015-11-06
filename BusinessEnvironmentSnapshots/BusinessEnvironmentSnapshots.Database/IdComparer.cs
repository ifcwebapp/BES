using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEnvironmentSnapshots.Database
{
    class IdComparer : IComparer<int>
    {
        private Dictionary<int, int> localIds;

        public IdComparer(IEnumerable<int> ids)
        {
            this.localIds = ids.Select((id, i) => new KeyValuePair<int, int>(id, i)).ToDictionary(k => k.Key, k => k.Value);
        }

        public int Compare(int x, int y)
        {
            return localIds[x].CompareTo(localIds[y]);
        }
    }
}
